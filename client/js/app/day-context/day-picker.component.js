import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'day-picker',
    template: `
      <p (click)='selectDate(date)'>pick a day</p>
    `
})

export class DayPickerComponent {
  date = new Date(Date.UTC(1980, 0, 11));
  @Output() onDateSelected = new EventEmitter();

  selectDate(date) {
    console.log('day picker shouts ', date);
    this.onDateSelected.emit(date);
  }
}
