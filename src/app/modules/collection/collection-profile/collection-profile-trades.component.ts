import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { Collection, Item } from 'src/app/core';

@Component({
  selector: 'app-collection-profile-trades',
  templateUrl: 'collection-profile-trades.component.html',
  standalone: true,
  imports: [MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProfileTradesComponent {
  @Input() collection!: Collection;
  @Input() items: Item[] = [];

  get userWishing(): Item[] {
    return this.items
      .filter((item) => item.wishlist == true)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  }

  get userTrading(): Item[] {
    return this.items
      .filter((item) => item.tradelist == true)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  }
}
