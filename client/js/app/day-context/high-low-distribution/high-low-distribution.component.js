import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { D3Service, D3, Selection, ScaleLinear } from 'd3-ng2-service';

@Component({
    selector: 'high-low-distribution',
    template: `
      <h4>-high and low temp-</h4>
      <svg></svg>
    `,
    host: {
      '(window:resize)': 'renderPlot($event)'
    }
})


export class HighLowDistributionComponent {
  @Input() observation = '';
  @Input() historical = '';

  d3 = undefined;
  parentNativeElement = undefined;
  svg = undefined;

  constructor(element:ElementRef, d3Service:D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.renderPlot();
  }

  ngOnChanges() {
    this.renderPlot();
  }

  ngOnDestroy() {
    this.clearPlot();
  }

  renderPlot() {
    let d3 = this.d3;
    let d3ParentElement;
    let svg;

    // TODO maybe check if observation is ZoneAwarePromise and show loading

    // TODO be clever about label positions and plot margins etc.
    if (this.parentNativeElement !== null && this.observation.date && this.historical.highs) {
      d3ParentElement = d3.select(this.parentNativeElement);
      var elWidth = this.parentNativeElement.getBoundingClientRect().width;
      if (elWidth === 0) {
        elWidth = window.innerWidth <= 767 ? window.innerWidth : window.innerWidth / 2;
      }
      this.clearPlot();
      // set up plot svg elements
      const margin = {top: 15, bottom: 30, left: 20, right: 20};
      const width = elWidth - margin.left - margin.right;
      const height = elWidth * 0.6 - margin.top - margin.bottom;
      this.svg = d3ParentElement.select('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
      this.svg.append('rect')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'plot-background');
      svg = this.svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // construct scales and axes
      const minX = d3.min(this.historical.lows);
      const maxX = d3.max(this.historical.highs);
      const minHigh = d3.min(this.historical.highs);
      const maxLow = d3.max(this.historical.lows);
      const domainPad = (maxX - minX) * 0.15;
      const x = d3.scaleLinear()
        .range([0, width])
        .domain([minX - domainPad, maxX + domainPad]);
      const y = d3.scaleLinear()
        .range([height, 0]);
      const line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]));
      // setup kernel density estimator
      const bandwidthH = 1.06 * d3.deviation(this.historical.highs) / Math.pow(this.historical.highs.length, 0.2);
      const bandwidthL = 1.06 * d3.deviation(this.historical.lows) / Math.pow(this.historical.lows.length, 0.2);
      const kdeH = kernelDensityEstimator(epanechnikovKernel(bandwidthH), x.ticks(200));
      const kdeL = kernelDensityEstimator(epanechnikovKernel(bandwidthL), x.ticks(200));
      const distH = kdeH(this.historical.highs).filter(d => d[0] >= minHigh && d[0] <= maxX);
      const distL = kdeL(this.historical.lows).filter(d => d[0] <= maxLow && d[0] >= minX);;
      const maxY = d3.max([d3.max(distH.map(x => x[1])), d3.max(distL.map(x => x[1]))]);
      const rangePad = maxY * 0.2;
      y.domain([0, maxY + rangePad]);

      svg.append('path')
          .datum(distH)
          .attr('class', 'line kde-high')
          .attr('d', line);
      svg.append('path')
          .datum(distL)
          .attr('class', 'line kde-low')
          .attr('d', line);

      const bisector = d3.bisector(d => d[0]).left;
      const idxH = d3.min([bisector(distH, +this.observation.high), distH.length - 1]);
      const idxL = d3.min([bisector(distL, +this.observation.low), distL.length - 1]);
      const highLine = [
        [+this.observation.high, distH[idxH][1]],
        [+this.observation.high, maxY + rangePad / 2]
      ];
      const lowLine = [
        [+this.observation.low, distL[idxL][1]],
        [+this.observation.low, maxY + rangePad / 2]
      ];
      svg.append('path')
          .datum(highLine)
          .attr('class', 'line high')
          .attr('d', line);
      svg.append('path')
          .datum(lowLine)
          .attr('class', 'line low')
          .attr('d', line);
      svg.append('circle')
          .attr('cx', x(highLine[0][0]))
          .attr('cy', y(highLine[0][1]))
          .attr('r', '5px')
          .attr('class', 'dot-high');
      svg.append('circle')
          .attr('cx', x(lowLine[0][0]))
          .attr('cy', y(lowLine[0][1]))
          .attr('r', '5px')
          .attr('class', 'dot-low');
      svg.append('text')
          .attr('x', x(highLine[1][0]))
          .attr('y', y(highLine[1][1]))
          //.attr('dx', '10px')
          .attr('class','text-high-main')
          .text(this.observation.high + '\u00B0F');
      svg.append('text')
          .attr('x', x(lowLine[1][0]))
          .attr('y', y(lowLine[1][1]))
          .attr('text-anchor', 'end')
          //.attr('dx', '-10px')
          .attr('class','text-low-main')
          .text(this.observation.low + '\u00B0F');
      svg.append('text')
          .attr('x', x(highLine[1][0]))
          .attr('y', y(highLine[1][1]))
          .attr('dx', '10px')
          .attr('dy', '15px')
          .attr('class','text-high-sub')
          .text(ordinalize(100 * d3.bisect(this.historical.highs.sort((a, b)=> a - b), this.observation.high) / this.historical.highs.length) + ' %');
      svg.append('text')
          .attr('x', x(lowLine[1][0]))
          .attr('y', y(lowLine[1][1]))
          .attr('text-anchor', 'end')
          .attr('dx', '-10px')
          .attr('dy', '15px')
          .attr('class','text-low-sub')
          .text(ordinalize(100 * d3.bisect(this.historical.lows.sort((a, b) => a - b), this.observation.low) / this.historical.lows.length) + ' %');
      svg.append('text')
          .attr('x', x(minX))
          .attr('y', y(0))
          .attr('text-anchor', 'end')
          .attr('dy', '15px')
          .attr('class','text-low-sub')
          .text(minX + '\u00B0F');
      svg.append('text')
          .attr('x', x(maxX))
          .attr('y', y(0))
          .attr('dy', '15px')
          .attr('class','text-high-sub')
          .text(maxX + '\u00B0F');
    }

    function kernelDensityEstimator(kernel, x) {
      return sample => x.map(x => [x, d3.mean(sample, v => kernel(x - v))]);
    }

    function epanechnikovKernel(scale) {
      return u => Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0;
    }

    function ordinalize(n) {
      let ni = Math.round(n);
      return ni + ordinalSuffixOf(ni);
    }

    function ordinalSuffixOf(i) {
      let j = i % 10;
      let k = i % 100;
      if (j == 1 && k != 11) {
          return 'st';
      }
      if (j == 2 && k != 12) {
          return 'nd';
      }
      if (j == 3 && k != 13) {
          return 'rd';
      }
      return 'th';
    }
  }

  clearPlot() {
    if (this.svg && this.svg.empty && !this.svg.empty()) {
      this.svg.selectAll('*').remove();
    }
  }
}
