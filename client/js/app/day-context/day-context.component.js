import { Component, OnInit }            from '@angular/core';
import { ObservationService }   from '../observation.service';


@Component({
    selector: 'day-context',
    template: `
      <div class='row'>
        <day-picker
          (onDateSelected)='onDateSelected($event)'></day-picker>
      </div>
      <div class='row'>
        <high-low-distribution class='col-sm-6 col-no-pad'
          [observation]='observation'
          [historical]='historical'></high-low-distribution>
        <precipitation class='col-sm-6 col-no-pad'
          [observation]='observation'
          [historical]='historical'></precipitation>
      </div>
      <div class='row'>
        <snowfall class='col-sm-6 col-no-pad'
          [observation]='observation'
          [historical]='historical'></snowfall>
        <snowdepth class='col-sm-6 col-no-pad'
          [observation]='observation'
          [historical]='historical'></snowdepth>
      </div>
    `,
    providers:[ObservationService]
})

export class DayContextComponent {
  observation = {};
  historical = {};

  constructor(observationService:ObservationService) {
    this.observationService = observationService;
  }

  ngOnInit() {
    this.onDateSelected(new Date(Date.UTC(2009, 2, 3)));
  }

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
                                             .then(resp => this.historical = resp);
  }
}
