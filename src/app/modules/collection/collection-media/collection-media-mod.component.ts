import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Media } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collection-media-mod',
  templateUrl: './collection-media-mod.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DatePipe],
})
export class CollectionMediaModComponent {
  @Input() imagesForModeration: Media[] = [];
  @Input() isProcessing = false;
  @Output() onDeleteImage = new EventEmitter<number>();

  baseForModImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/v1/${environment.cloudinary.site}/collectionMedia/`;

  get images(): Media[] {
    return this.imagesForModeration;
  }
}
