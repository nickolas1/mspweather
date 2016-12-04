// vendor
import { NgModule }                       from '@angular/core';
import { BrowserModule }                  from '@angular/platform-browser';
import { HttpModule }                     from '@angular/http';

import { D3Service }                      from 'd3-ng2-service';

// app
import { AppComponent}                    from './app.component';
import { DayContextComponent }            from './day-context/day-context.component';
import { HighLowDistributionComponent }   from './day-context/high-low-distribution/high-low-distribution.component';
import { PrecipitationComponent }         from './day-context/precipitation.component';
import { WinterWeatherComponent }         from './day-context/winter-weather.component';
import { DayPickerComponent }             from './day-context/day-picker.component';

import { ObservationService }             from './observation.service';


@NgModule({
    imports: [
      BrowserModule,
      HttpModule
    ],
    declarations: [
      AppComponent,
      DayContextComponent,
      HighLowDistributionComponent,
      PrecipitationComponent,
      WinterWeatherComponent,
      DayPickerComponent
    ],
    providers: [
      ObservationService,
      D3Service
    ],
    bootstrap: [
      AppComponent
    ]
})

export class AppModule {}
