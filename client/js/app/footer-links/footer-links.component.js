import { Component, EventEmitter, Output, OnInit,
     trigger, state, style, transition, animate}  from '@angular/core';

@Component({
    selector: 'footer-links',
    template: `
    <div class='container-fluid'>
      <footer class='footer'>
        <span class='what-wrapper'>
          <i class='fa fa-3x fa-question-circle clickable what-toggle'
            (click)='toggleIsWhatCollapsed()'></i>
        </span>
        <span class='connectivity-wrapper pull-right'>
          <i class='fa fa-3x fa-github-square clickable'
            (click) = goGithub();></i>
          <i class='fa fa-3x fa-twitter-square clickable'
            (click) = goTwitter()></i>
          <i class='fa fa-3x fa-envelope-square clickable'
            (click) = goEmail()></i>
        </span>
      </footer>
      <div [@whatPanel]='whatPanelState' class='what-body'>
        <div class='container'>
          <div class='row'>
            <i class='fa fa-3x fa-times clickable pull-right'
              (click)='toggleIsWhatCollapsed()'></i>
          </div>
          <blockquote class='blockquote'>
          ...deal with temperatures a touch below average for this time of year...
            <footer class='blockquote-footer'>Paul Douglas</footer>
          </blockquote>
          <p>
            As statistical descriptions go, the average is pretty boring! How weird
            of a day is it? What's the distribution look like? This page shows you the High and
            Low temperatures and Precipitation recorded at the MSP weather station compared to the historical
            distribution, cobbled together from MSP and nearby sources back to 1873.
            The curves show a kernel density estimate of that data.
          </p>
          <blockquote class='blockquote'>
          Bit of a difference in snow cover this year to last: we average 10" in November we've seen only 1.1!"
            <footer class='blockquote-footer'>Sven Sundgaard</footer>
          </blockquote>
          <p>
            Average snowfall- boring! What if the distribution is multimodal? Argh! If the
            date you're looking at has seen at least a few historical days recording trace amounts of snowfall or snow depth,
            those distributions are plotted too.
          </p>
          <p>
            <img src='./img/explainer.png' class='img-fluid mx-auto d-block'>
          </p>
        </div>
      </div>
    </div>
    `,
    animations: [
      trigger('whatPanel', [
        state('hidden', style({
          top: '100%'
        })),
        state('visible',   style({
          top: 0,
          overflow: 'auto'
        })),
        transition('hidden => visible', animate('200ms ease-out')),
        transition('visible => hidden', animate('200ms ease-in'))
      ])
    ]
})

export class FooterLinksComponent {
  ngOnInit() {
    this.isWhatCollapsed = true;
    this.whatPanelState = 'hidden';
  }

  goGithub() {
    window.location = 'https://github.com/nickolas1/mspweather';
  }

  goTwitter() {
    window.location = 'https://twitter.com/nickolas1';
  }

  goEmail() {
    window.location.href = 'mailto:nickolas1@gmail.com';
  }

  @Output() onWhatToggled = new EventEmitter();

  toggleIsWhatCollapsed() {
    this.isWhatCollapsed = !this.isWhatCollapsed;
    this.whatPanelState = this.isWhatCollapsed ? 'hidden' : 'visible';
    this.onWhatToggled.emit(this.isWhatCollapsed);
  }
}
