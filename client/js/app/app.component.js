import { Component, OnInit,
     trigger, state, style, transition, animate }            from '@angular/core';

@Component({
    selector: 'app',
    //templateUrl: 'templates/app-component'
    template: `
        <div class='container-fluid'>
          <div [@hideContent]='showMainContent'>
            <router-outlet></router-outlet>
          </div>
          <footer-links
            (onWhatToggled)='onWhatToggled($event)'></footer-links>
        </div>
    `,
    animations: [
      trigger('hideContent', [
        state('visible', style({

        })),
        state('hidden',   style({
          display: 'none'
        })),
        transition('visible => hidden', animate('1ms 200ms')),
        transition('hidden => visible', animate('1ms 1ms'))
      ])
    ]
})

export class AppComponent {
  ngOnInit() {
    this.showMainContent = true;
  }
  onWhatToggled(isWhatCollapsed) {
    this.showMainContent = isWhatCollapsed ? 'visible' : 'hidden';
  }
}
