import { Component, EventEmitter, Output, OnInit }  from '@angular/core';
import { NgbDropdown, NgbDropdownToggle }           from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute }                   from '@angular/router';

@Component({
    selector: 'day-picker',
    template: `
      <div class='row'>
        <div class='col-sm-3 hidden-xs-down date-zoomer date-zoomer-minus'>
          <div (click)='bumpDate(-1, "y")'>y</div>
          <div (click)='bumpDate(-1, "M")'>m</div>
          <div (click)='bumpDate(-1, "d")'>d</div>
        </div>
        <div class='col-sm-6 col-xs-12 date-display-wrapper'>
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
        <div class='col-sm-3 hidden-xs-down date-zoomer date-zoomer-plus'>
          <div (click)='bumpDate(1, "d")'>d</div>
          <div (click)='bumpDate(1, "M")'>m</div>
          <div (click)='bumpDate(1, "y")'>y</div>
        </div>
      </div>

      <div class='row hidden-sm-up'>
        <div class='col-xs-6 date-zoomer date-zoomer-xs'>
          <span (click)='bumpDate(-1, "y")'><< y</span>
          <span (click)='bumpDate(-1, "M")'>m</span>
          <span (click)='bumpDate(-1, "d")'>d</span>
        </div>
        <div class='col-xs-6 date-zoomer date-zoomer-xs'>
          <span (click)='bumpDate(1, "d")'>d</span>
          <span (click)='bumpDate(1, "M")'>m</span>
          <span (click)='bumpDate(1, "y")'>y >></span>
        </div>
      </div>
    `
})

export class DayPickerComponent {
  constructor(router:Router, route:ActivatedRoute) {
    this.router = router;
    this.route = route;
  }
  
  ngOnInit() {
    this.lastAvailableDay = moment.utc(moment().format('YYYY-MM-DD')).subtract(1, 'day');
    this.firstEverDay = moment.utc('1873-01-01');
    this.route.params.subscribe(params => {
      const initialDay = moment.utc(params.y + '-' + params.m + '-' + params.d, 'YYYY-MM-DD');
      this.setPickers(initialDay);
    });
  }
  
  setPickers(initialDay) {
    let date = initialDay.isValid() ? initialDay : this.lastAvailableDay;
    this.month = {
      possibles: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      val: date.format('MMMM')
    };
    this.year = {
      possibles: this.getYearPossibilities(),
      val: date.format('YYYY')
    };
    this.day = {
      possibles: [],
      val: date.format('D'),
      disp: date.format('Do')
    };
    
    this.setDayPossibilities();
    this.selectDate();
  }

  selectMonth(m) {
    this.checkBoundsAndSetDate(this.getUTCDateFromYMD(this.year.val, m, this.day.val));
  }
  selectDay(d) {
    this.checkBoundsAndSetDate(this.getUTCDateFromYMD(this.year.val, this.month.val, d));
  }
  selectYear(y) {
    this.checkBoundsAndSetDate(this.getUTCDateFromYMD(y, this.month.val, this.day.val));
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

  // adjust the date from the increment / decrement buttons
  bumpDate(direction, quantity) {
    let date = this.getUTCDateFromInputs();
    date.add(direction, quantity);
    if (date.isAfter(this.lastAvailableDay)) date = this.lastAvailableDay.clone();
    this.checkBoundsAndSetDate(date);
  }

  // ensure requested date is between today and the start of data
  checkBoundsAndSetDate(date) {
    if (date.isAfter(this.lastAvailableDay)) date = this.lastAvailableDay.clone();
    if (date.isBefore(this.firstEverDay)) date = this.firstEverDay.clone();
    this.year.val = date.format('YYYY');
    this.month.val = date.format('MMMM');
    this.day.val = date.format('D');
    this.setDayPossibilities();
    this.selectDate();
  }

  getUTCDateFromInputs() {
    return this.getUTCDateFromYMD(this.year.val, this.month.val, this.day.val);
  }

  getUTCDateFromYMD(y, m, d) {
    return moment.utc(y + '-' + m + '-' + d, 'YYYY-MMMM-D');
  }

  @Output() onDateSelected = new EventEmitter();

  // broadcast the date to the parent component
  selectDate() {
    let date = this.getUTCDateFromInputs();
    this.onDateSelected.emit(date.toDate());
    this.router.navigateByUrl('/day/' + date.format('YYYY') + '/' +
                                        date.format('MM') + '/' +
                                        date.format('DD'));
  }
}
