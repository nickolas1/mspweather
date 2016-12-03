import { NgModule }                       from '@angular/core';
import { BrowserModule }                  from '@angular/platform-browser';
import { AppComponent}                    from './app.component';
import { DayContextComponent }            from './day-context/day-context.component';
import { HighLowDistributionComponent }   from './day-context/high-low-distribution.component';
import { PrecipitationComponent }         from './day-context/precipitation.component';
import { WinterWeatherComponent }         from './day-context/winter-weather.component';
import { DayPickerComponent }             from './day-context/day-picker.component';


@NgModule({
    imports:        [ BrowserModule ],
    declarations:   [
      AppComponent,
      DayContextComponent,
      HighLowDistributionComponent,
      PrecipitationComponent,
      WinterWeatherComponent,
      DayPickerComponent
    ],
    bootstrap:      [ AppComponent ],
})

export class AppModule {}
