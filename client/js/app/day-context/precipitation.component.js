import { Component, Input } from '@angular/core';

@Component({
    selector: 'precipitation',
    template: `
      <p>precipitation: {{observation.precip}}</p>
    `
})

export class PrecipitationComponent {
  @Input() observation = '';
}
