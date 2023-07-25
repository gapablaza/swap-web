import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks'
})
export class LinebreaksPipe implements PipeTransform {

  transform(text: any): any {
    return text.replace(/\n/g, "<br>");
  }
}