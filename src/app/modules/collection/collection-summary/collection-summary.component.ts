import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { AdLoaderComponent } from 'src/app/shared/components/ad-loader/ad-loader.component';

@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,

    MatButtonModule,
    MatIconModule,
    
    AdLoaderComponent,
  ],
})
export class CollectionSummaryComponent {
  @Input() collection!: Collection;
  @Input() showBackButton = false;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  constructor(private uiSrv: UIService) {}

  onShare() {
    this.uiSrv.shareUrl();
  }

  get publisher() {
    return this.collection?.publisher?.data;
  }
}
