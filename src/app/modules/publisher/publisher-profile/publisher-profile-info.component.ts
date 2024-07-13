import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Collection, Publisher } from 'src/app/core';
import { MarkdownPipe } from 'src/app/shared';
import { PublisherProfileCollectionsComponent } from './publisher-profile-collections.component';

@Component({
  selector: 'app-publisher-profile-info',
  templateUrl: './publisher-profile-info.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MarkdownPipe,
    PublisherProfileCollectionsComponent,
  ],
})
export class PublisherProfileInfoComponent {
  publisher = input.required<Publisher>();
  collections = input.required<Collection[]>();

  @Output() onShare = new EventEmitter<void>();
}
