import { Component }            from '@angular/core';

@Component({
    selector: 'app',
    //templateUrl: 'templates/app-component'
    template: `
      <div class='container-fluid'>
        <router-outlet></router-outlet>
      </div>
    `
})

export class AppComponent { name = 'Angular' }
