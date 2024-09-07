import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styles: `@import './src/styles/pages/_new-collection.scss';`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class NewCollectionComponent {}
