import { Component } from '@angular/core';

@Component({
    selector: 'day-context',
    template: `
      <day-picker
        (onDateSelected)='onDateSelected($event)'></day-picker>
      <high-low-distribution
        [observation]='observation'></high-low-distribution>
      <precipitation
        [observation]='observation'></precipitation>
      <winter-weather
        [observation]='observation'></winter-weather>
    `
})

export class DayContextComponent {
  observation = 'hi';
  onDateSelected(date) {
    console.log('day context hears ', date);
    this.observation = date;
  }
}
