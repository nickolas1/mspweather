import { Component, Input } from '@angular/core';

@Component({
    selector: 'high-low-distribution',
    template: `
      <p>temperature distribution: {{observation}}</p>
    `
})

export class HighLowDistributionComponent {
  @Input() observation = '';
}
