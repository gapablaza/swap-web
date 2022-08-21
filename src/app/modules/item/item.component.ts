import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Collection, DEFAULT_USER_PROFILE_IMG, Item, User } from 'src/app/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
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

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TO DO: Manejar el caso cuando no se encuentre el ítem solicitado
    this.route.data.subscribe((data) => {
      console.log(data['itemData']);
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
