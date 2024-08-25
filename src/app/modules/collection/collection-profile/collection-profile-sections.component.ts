import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import {
  Collection,
  DEFAULT_USER_PROFILE_IMG,
  Media,
  User,
} from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collection-profile-sections',
  templateUrl: 'collection-profile-sections.component.html',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProfileSectionsComponent {
  @Input() collection!: Collection;
  @Input() lastCollectors: User[] = [];
  @Input() lastMedia: Media[] = [];
  @Input() isAuth = false;

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
}
