import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Collection, DEFAULT_USER_PROFILE_IMG, Item, User } from 'src/app/core';
import { SlugifyPipe } from '../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitize-html.pipe';
import { DaysSinceLoginDirective } from '../../shared/directives/days-since-login.directive';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgFor,
    LazyLoadImageModule,
    DaysSinceLoginDirective,
    SanitizeHtmlPipe,
    SlugifyPipe,
  ],
})
export class ItemComponent implements OnInit {
  item: Item = {} as Item;
  collection: Collection = {} as Collection;
  searchWishingText = '';
  usersWishing: User[] = [];
  showedUsersWishing: User[] = [];
  searchTradingText = '';
  usersTrading: User[] = [];
  showedUsersTrading: User[] = [];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  showFilters = false;
  isLoaded = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // TO DO: Manejar el caso cuando no se encuentre el ítem solicitado
    this.route.data.subscribe((data) => {
      this.item = data['itemData'].item;
      this.collection = data['itemData'].collection;

      this.usersWishing = (data['itemData'].wishing as User[]).sort(
        (a, b) => a.daysSinceLogin - b.daysSinceLogin
      );
      this.showedUsersWishing = [...this.usersWishing];

      this.usersTrading = (data['itemData'].trading as User[]).sort(
        (a, b) => a.daysSinceLogin - b.daysSinceLogin
      );
      this.showedUsersTrading = [...this.usersTrading];

      this.isLoaded = true;
    });
  }

  trackByUsers(index: number, item: User): number {
    return item.id;
  }

  onTradingFilter() {
    // check at least 2 chars for search
    if (this.searchTradingText.length > 1) {
      this.showedUsersTrading = [
        ...this.usersTrading.filter((elem: User) => {
          return (
            elem.displayName
              .toLocaleLowerCase()
              .indexOf(this.searchTradingText.toLocaleLowerCase()) !== -1 ||
            elem.id
              .toString()
              .indexOf(this.searchTradingText.toLocaleLowerCase()) !== -1 ||
            (elem.location_city || '')
              .toLocaleLowerCase()
              .indexOf(this.searchTradingText.toLocaleLowerCase()) !== -1 ||
            (elem.bio || '')
              .toLocaleLowerCase()
              .indexOf(this.searchTradingText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }
  }

  onClearTradingFilter() {
    this.searchTradingText = '';
    this.showedUsersTrading = [...this.usersTrading];
  }

  onWishingFilter() {
    // check at least 2 chars for search
    if (this.searchWishingText.length > 1) {
      this.showedUsersWishing = [
        ...this.usersWishing.filter((elem: User) => {
          return (
            elem.displayName
              .toLocaleLowerCase()
              .indexOf(this.searchWishingText.toLocaleLowerCase()) !== -1 ||
            elem.id
              .toString()
              .indexOf(this.searchWishingText.toLocaleLowerCase()) !== -1 ||
            (elem.location_city || '')
              .toLocaleLowerCase()
              .indexOf(this.searchWishingText.toLocaleLowerCase()) !== -1 ||
            (elem.bio || '')
              .toLocaleLowerCase()
              .indexOf(this.searchWishingText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }
  }

  onClearWishingFilter() {
    this.searchWishingText = '';
    this.showedUsersWishing = [...this.usersWishing];
  }
}
