import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'linebreaks',
    standalone: true
})
export class LinebreaksPipe implements PipeTransform {

  transform(text: any): any {
    return text.replace(/\n/g, "<br>");
  }
}