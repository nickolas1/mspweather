import { Component, OnInit }            from '@angular/core';

@Component({
    selector: 'app',
    //templateUrl: 'templates/app-component'
    template: `
      <div class='container-fluid'>
        <div [hidden]='!showMainContent'>
          <router-outlet></router-outlet>
        </div>
        <footer-links
          (onWhatToggled)='onWhatToggled($event)'></footer-links>
      </div>
    `
})

export class AppComponent {
  ngOnInit() {
    this.showMainContent = true;
  }
  onWhatToggled(isWhatCollapsed) {
    this.showMainContent = isWhatCollapsed;
  }
}
