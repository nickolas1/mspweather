import { Component } from '@angular/core';

@Component({
    selector: 'precipitation',
    template: `
      <p>precipitation</p>
    `
})

export class PrecipitationComponent {
  @Input() observation = '';
}
