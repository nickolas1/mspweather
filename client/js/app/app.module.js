// vendor
import { NgModule, enableProdMode }       from '@angular/core';
import { BrowserModule }                  from '@angular/platform-browser';
import { HttpModule }                     from '@angular/http';
import { RouterModule }                   from '@angular/router';

//import { D3Service }                      from 'd3-ng2-service';
import { D3Service }                      from './d3-service/d3.service';
//import { NgbModule }                      from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule }              from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';

// app
import { AppComponent}                    from './app.component';
import { DayContextComponent }            from './day-context/day-context.component';
import { HighLowDistributionComponent }   from './day-context/high-low-distribution/high-low-distribution.component';
import { DayPickerComponent }             from './day-context/day-picker/day-picker.component';
import { InchesPlotComponent }            from './day-context/inches-plot/inches-plot.component';
import { FooterLinksComponent }           from './footer-links/footer-links.component';

import { ObservationService }             from './observation.service';
import 'font-awesome-sass-loader';

enableProdMode();

const routes = [
    { path: 'day/:y/:m/:d', component: DayContextComponent },
    { path: '', component: DayContextComponent },
    { path: '**', component: DayContextComponent }
];

@NgModule({
    imports: [
      BrowserModule,
      HttpModule,
      NgbDropdownModule.forRoot(),
      RouterModule.forRoot(routes)
    ],
    declarations: [
      AppComponent,
      DayContextComponent,
      HighLowDistributionComponent,
      DayPickerComponent,
      InchesPlotComponent,
      FooterLinksComponent
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
