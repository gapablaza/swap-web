import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'slugify',
    standalone: true
})
export class SlugifyPipe implements PipeTransform {
  transform(input: string | null | undefined): string {

    if (input) {

      const trChars: any = {
        'áÁ': 'a',
        'éÉ': 'e',
        'íÍ': 'i',
        'óÓ': 'o',
        'úÚ': 'u',
        'ñÑ': 'n'
      };

      for (const key of Object.keys(trChars)) {
        input = input.replace(new RegExp('[' + key + ']', 'g'), trChars[key]);
      }

      return input.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text

    } else {
      return '';
    }
  }

}
