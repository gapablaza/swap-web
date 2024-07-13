import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Collection, Publisher } from 'src/app/core';
import { CollectionItemComponent } from 'src/app/shared/components/collection-item/collection-item.component';

@Component({
  selector: 'app-publisher-profile-collections',
  templateUrl: './publisher-profile-collections.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CollectionItemComponent,
  ],
})
export class PublisherProfileCollectionsComponent {
  publisher = input.required<Publisher>();
  collections = input.required<Collection[]>();
}
