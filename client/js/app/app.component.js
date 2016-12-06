import { Component }            from '@angular/core';

@Component({
    selector: 'app',
    //templateUrl: 'templates/app-component'
    template: `
      <div class='container-fluid'>
        <day-context></day-context>
      </div>
    `
})

export class AppComponent { name = 'Angular' }
