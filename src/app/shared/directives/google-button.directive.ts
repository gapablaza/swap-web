import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { SocialAuthService } from '@abacritt/angularx-social-login';

@Directive({
    selector: 'google-button',
    standalone: true,
})
export class GoogleButtonDirective implements OnInit {
  @Input('selectable') option: boolean = false;

  constructor(
    private el: ElementRef,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit() {
    if (!this.option) return;
    this.socialAuthService.initState.pipe(take(1)).subscribe(() => {
      // @ts-ignore
      google.accounts.id.renderButton(this.el.nativeElement, {
        type: 'standard',
        width: '200',
        size: 'large',
        text: 'signin_with',
        theme: 'filled_blue',
      });
    });
  }
}
