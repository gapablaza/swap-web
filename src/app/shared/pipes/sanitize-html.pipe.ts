import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml',
    standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string | null | undefined) {
    if (value) {
      return this.sanitized.bypassSecurityTrustHtml(value);
    } else {
      return null;
    }
  }

}
