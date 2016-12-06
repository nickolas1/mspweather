import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'day-picker',
    template: `
      <div class='row'>
        <div class='col-xs-2 date-zoomer date-zoomer-minus'>
          <span (click)='bumpDate(-1, "y")'>-y</span>
          <span (click)='bumpDate(-1, "M")'>m</span>
          <span (click)='bumpDate(-1, "d")'>d</span>
        </div>
        <div class='col-xs-8 date-display-wrapper'>
          <span ngbDropdown>
            <span ngbDropdownToggle class='date-display'>{{month.val}}</span>
            <div class='dropdown-menu'>
              <button class='dropdown-item' *ngFor='let m of month.possibles'
                (click)='selectMonth(m)'>{{m}}</button>
            </div>
          </span>

          <span ngbDropdown>
            <span ngbDropdownToggle class='date-display'>{{day.disp}}</span>
            <div class='dropdown-menu'>
              <button class='dropdown-item' *ngFor='let d of day.possibles'
                (click)='selectDay(d)'>{{d}}</button>
            </div>
          </span>

          <span ngbDropdown>
            <span ngbDropdownToggle class='date-display'>{{year.val}}</span>
            <div class='dropdown-menu'>
              <button class='dropdown-item' *ngFor='let y of year.possibles'
                (click)='selectYear(y)'>{{y}}</button>
            </div>
          </span>
        </div>
        <div class='col-xs-2 date-zoomer date-zoomer-plus'>
          <span (click)='bumpDate(1, "d")'>+d</span>
          <span (click)='bumpDate(1, "M")'>m</span>
          <span (click)='bumpDate(1, "y")'>y</span>
        </div>
      </div>
    `
})

export class DayPickerComponent {
  ngOnInit() {
    this.date = new Date(Date.UTC(1984, 11, 25));
    this.month = {
      possibles: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      val: moment(this.date).utc().format('MMMM')
    };
    this.year = {
      possibles: this.getYearPossibilities(),
      val: moment(this.date).utc().format('YYYY')
    };
    this.day = {
      possibles: [],
      val: moment(this.date).utc().format('D'),
      disp: moment(this.date).utc().format('Do')
    };
    this.setDayPossibilities();
  }

  selectMonth(m) {
    this.month.val = m;
    this.setDayPossibilities();
    this.selectDate();
  }
  selectDay(d) {
    this.day.val = d;
    this.day.disp = moment(this.year.val + '-' + this.month.val + '-' + this.day.val, 'YYYY-MMMM-D').utc().format('Do');
    this.selectDate();
  }
  selectYear(y) {
    this.year.val = y;
    this.setDayPossibilities();
    this.selectDate();
  }
  setDayPossibilities() {
    const min = 1;
    const max = moment(this.year.val + '-' + this.month.val, 'YYYY-MMMM').daysInMonth();
    let days = [];
    for (let d = min; d <= max; d++) days.push(d);
    this.day.val = Math.min(max, this.day.val);
    let d = this.getUTCDateFromInputs();
    this.day.disp = d.format('Do');
    this.day.possibles = days;
  }

  getYearPossibilities() {
    const min = 1873;
    const max = moment().year();
    let years = [];
    for (let y = max; y >= min; y--) years.push(y);
    return years;
  }

  bumpDate(direction, quantity) {
    let d = this.getUTCDateFromInputs();
    d.add(direction, quantity);
    this.year.val = d.format('YYYY');
    this.month.val = d.format('MMMM');
    this.day.val = d.format('D');
    this.setDayPossibilities();
    this.selectDate();
  }

  getUTCDateFromInputs() {
    return moment(this.year.val + '-' + this.month.val + '-' + this.day.val, 'YYYY-MMMM-D').utc();
  }

  @Output() onDateSelected = new EventEmitter();

  selectDate() {
    let date = this.getUTCDateFromInputs();
    console.log('day picker shouts ', date.toDate());
    this.onDateSelected.emit(date.toDate());
  }
}
