import { Component } from '@angular/core';

@Component({
    selector: 'winter-weather',
    template: `
      <p>winter weather</p>
    `
})

export class WinterWeatherComponent {
  @Input() observation = '';
}
