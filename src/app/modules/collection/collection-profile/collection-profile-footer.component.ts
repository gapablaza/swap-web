import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection } from 'src/app/core';
import { MarkdownPipe, SlugifyPipe } from 'src/app/shared';

@Component({
  selector: 'app-collection-profile-footer',
  templateUrl: 'collection-profile-footer.component.html',
  standalone: true,
  imports: [RouterLink, MarkdownPipe, SlugifyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProfileFooterComponent {
  @Input() collection!: Collection;
}
