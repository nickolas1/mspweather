import { Component, OnInit }      from '@angular/core';
import { ObservationService }     from '../observation.service';
import { Router }                 from '@angular/router';

@Component({
    selector: 'day-context',
    template: `
      <div class='row'>
        <day-picker
          (onDateSelected)='onDateSelected($event)'></day-picker>
      </div>
      <div class='row'>
        <high-low-distribution class='col-md-6'
          [observation]='observation'
          [historical]='historical'></high-low-distribution>
        <inches-plot class='col-md-6 precipitation'
          title='precipitation'
          traceReplacement=0.001
          [observation]='observation.precip'
          [historical]='historical.precip'></inches-plot>
      </div>
      <div class='row' *ngIf='isWinter'>
        <inches-plot class='col-md-6 snowfall' *ngIf='isSnowfall'
          title='snowfall'
          traceReplacement=0.01
          [observation]='observation.snowfall'
          [historical]='historical.snowfall'></inches-plot>
        <inches-plot class='col-md-6 snowdepth' *ngIf='isSnowdepth'
          title='snowdepth'
          traceReplacement=0.01
          [observation]='observation.snowdepth'
          [historical]='historical.snowdepth'></inches-plot>
      </div>
    `,
    providers:[ObservationService]
})

export class DayContextComponent {
  observation = {};
  historical = {};
  isWinter = false;

  constructor(observationService:ObservationService, router:Router) {
    this.observationService = observationService;
    this.router = router;
  }

  // ngOnInit() {
  //   console.log(this.route)
  //   //this.onDateSelected(new Date(Date.UTC(2009, 2, 3)));
  // }

  // onDateSelected(date) {
  //   console.log('day context hears ', date);
  //   this.getObservation(date);
  // }
  //
  // getObservation(date) {
  onDateSelected(date) {
    console.log('day context hears ', date);
    this.observation = this.observationService.getSingleObservation(date)
                                              .then(resp => this.observation = resp);
    this.historical = this.observationService.getManyObservations(date)
                                             .then(resp => {
                                               this.historical = resp;
                                               this.isWinter = resp.isWinter;
                                               this.isSnowfall = resp.isSnowfall;
                                               this.isSnowdepth = resp.isSnowdepth;
                                             });
  }
}
