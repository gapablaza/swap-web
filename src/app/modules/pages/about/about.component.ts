import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
})
export class AboutComponent {
  isCapacitorNative = (win: any): boolean => {
    const capacitor = win['Capacitor'];
    return !!(capacitor && capacitor.isNative);
  };

  get isNative(): boolean {
    return this.isCapacitorNative(window) ? true : false;
  }
}
