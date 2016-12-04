import { Component, Input } from '@angular/core';

@Component({
    selector: 'winter-weather',
    template: `
      <p>winter weather: {{observation.snowfall}}</p>
    `
})

export class WinterWeatherComponent {
  @Input() observation = '';
}
