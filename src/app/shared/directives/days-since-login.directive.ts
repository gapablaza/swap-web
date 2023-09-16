import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appDaysSinceLogin]',
    standalone: true,
})
export class DaysSinceLoginDirective implements OnInit {
  @Input() appDaysSinceLogin: any;
  @Input() preText = 'Visto ';

  days = 0;
  beforeText = '';
  text = '';
  afterText = '';
  cssClass = 'success';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.days = parseInt(this.appDaysSinceLogin);

    if (this.days > 365) {
      this.beforeText = 'hace ';
      this.cssClass = 'danger';
      this.text = 'mucho tiempo';
    } else if (this.days > 90) {
      this.beforeText = 'hace ';
      this.cssClass = 'danger';
      this.text = 'más de 3';
      this.afterText = ' meses';
    } else if (this.days > 30) {
      this.beforeText = 'hace ';
      this.cssClass = 'warning';
      this.text = 'más de 1';
      this.afterText = ' mes';
    } else if (this.days >= 7) {
      this.beforeText = 'hace ';
      this.cssClass = 'warning';
      this.text = this.days.toString();
      this.afterText = ' días';
    } else if (this.days >= 2) {
      this.beforeText = 'hace ';
      this.text = this.days.toString();
      this.afterText = ' días';
    } else if (this.days == 1) {
      this.beforeText = 'hace ';
      this.text = this.days.toString();
      this.afterText = ' día';
    } else if (this.days == 0) {
      this.text = 'hoy';
    }

    this.el.nativeElement.innerHTML = 
      `${this.preText}${this.beforeText}<span class="${this.cssClass}">${this.text}</span>${this.afterText}`;
  }
}
