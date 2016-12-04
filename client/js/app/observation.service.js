import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const ONE_OBERVATION_URL_BASE = '/observation';
const MANY_OBSERVATIONS_URL_BASE = '/observations';

function getMDYFromDate(date) {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth();
  let d = date.getUTCDate();
  return {year: y, month: m, day: d};
}

@Injectable()
export class ObservationService {

  constructor(http: Http) {
    this.http = http;
  }

  genericGet(url) {
    return this.http.get(url)
                    .toPromise()
                    .then(response => response.json());
  }

  getSingleObservation(date) {
    let ymd = getMDYFromDate(date);
    let url = ONE_OBERVATION_URL_BASE + '/' + ymd.year + '/' + ymd.month + '/' + ymd.day;
    return this.genericGet(url);
  }

  getManyObservations(date) {
    let ymd = getMDYFromDate(date);
    let url = MANY_OBSERVATIONS_URL_BASE + '/' + (ymd.month + 1) + '/' + ymd.day; //ymd.month is 0 based
    return this.genericGet(url);
  }
}
