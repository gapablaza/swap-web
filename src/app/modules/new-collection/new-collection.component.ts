import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class NewCollectionComponent {}
