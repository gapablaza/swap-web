import { Component } from '@angular/core';
import { DEFAULT_COLLECTION_IMG, DEFAULT_USER_PROFILE_IMG } from 'src/app/core';

@Component({
  selector: 'app-home-placeholder',
  templateUrl: './home-placeholder.component.html',
  standalone: true,
})
export class HomePlaceholderComponent {
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  defaultProfileImage = DEFAULT_USER_PROFILE_IMG;
}
