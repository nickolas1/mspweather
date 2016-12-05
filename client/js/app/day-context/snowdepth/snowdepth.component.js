import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { D3Service, D3, Selection, ScaleLinear } from 'd3-ng2-service';

@Component({
    selector: 'snowdepth',
    template: `
      <h3>-snow depth-</h3>
      <svg></svg>
    `
})


export class SnowdepthComponent {
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
      const obsField = this.observation.snowdepth;
      const histField = this.historical.snowdepth.sort();

      const obs = obsField === 'T' ? 0.01 : +obsField
      const obsText = obsField === 'T' ? 'trace' : obs + '"';

      this.clearPlot();
      // set up plot svg elements
      d3ParentElement = d3.select(this.parentNativeElement);
      const margin = {top: 10, bottom: 30, left: 20, right: 20};
      const width = d3ParentElement._groups[0][0].clientWidth - margin.left - margin.right;
      const height = d3ParentElement._groups[0][0].clientWidth * 0.6 - margin.top - margin.bottom;
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
      const minX = d3.min([obs, d3.min(histField)]);
      const maxX = d3.max([obs, d3.max(histField)]);
      const minVal = d3.min(histField);
      const maxVal = d3.max(histField);
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
      const bandwidth = 1.06 * d3.deviation(histField) / Math.pow(histField.length, 0.2);
      const kde = kernelDensityEstimator(epanechnikovKernel(bandwidth), x.ticks(200));
      const dist = kde(histField).filter(d => d[0] >= minX && d[0] <= maxX);
      const maxY = d3.max(dist.map(x => x[1]));
      const rangePad = maxY * 0.2;
      y.domain([0, maxY + rangePad]);

      svg.append('path')
          .datum(dist)
          .attr('class', 'line kde')
          .attr('d', line);

      const bisector = d3.bisector(d => d[0]).left;
      const idx = bisector(dist, obs);
      const obsLine = [
        [obs, dist[idx][1]],
        [obs, maxY + rangePad / 2]
      ];
      svg.append('path')
          .datum(obsLine)
          .attr('class', 'line observation')
          .attr('d', line);
      svg.append('circle')
          .attr('cx', x(obsLine[0][0]))
          .attr('cy', y(obsLine[0][1]))
          .attr('r', '5px')
          .attr('class', 'dot');
      svg.append('text')
          .attr('x', x(obsLine[1][0]))
          .attr('y', y(obsLine[1][1]))
          //.attr('dx', '10px')
          .attr('class','text-main')
          .text(obsText);
      svg.append('text')
          .attr('x', x(obsLine[1][0]))
          .attr('y', y(obsLine[1][1]))
          .attr('dx', '10px')
          .attr('dy', '17px')
          .attr('class','text-sub')
          .text(ordinalize(100 * d3.bisect(histField, obs) / histField.length) + ' %');
      svg.append('text')
          .attr('x', x(minX))
          .attr('y', y(0))
          .attr('text-anchor', 'end')
          .attr('dy', '17px')
          .attr('class','text-sub')
          .text(minX + '"');
      svg.append('text')
          .attr('x', x(maxX))
          .attr('y', y(0))
          .attr('dy', '17px')
          .attr('class','text-sub')
          .text(maxX + '"');
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
