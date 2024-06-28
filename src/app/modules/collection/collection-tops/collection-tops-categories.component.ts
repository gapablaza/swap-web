import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Tops, User } from 'src/app/core';

@Component({
  selector: 'app-collection-tops-categories',
  templateUrl: 'collection-tops-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatIconModule,
    MatAccordion,
    MatExpansionModule,
  ],
})
export class CollectionTopsCategoriesComponent {
  @Input() authUser!: User;
  @Input() tops!: Tops;

  @ViewChild(MatAccordion) accordion!: MatAccordion;
}
