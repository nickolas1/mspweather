import { Component }            from '@angular/core';

@Component({
    selector: 'app',
    //templateUrl: 'templates/app-component'
    template: `
      <h1>Hello {{name}}</h1>
      <day-context>

      </day-context>
    `
})

export class AppComponent { name = 'Angular' }
