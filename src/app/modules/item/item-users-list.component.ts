import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { DaysSinceLoginDirective, SanitizeHtmlPipe } from 'src/app/shared';

@Component({
  selector: 'app-item-users-list',
  templateUrl: './item-users-list.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    LazyLoadImageModule,

    SanitizeHtmlPipe,
    DaysSinceLoginDirective,
  ],
})
export class ItemUsersListComponent {
  users = input.required<User[]>();
  managedUsers = computed(() =>
    this.users().filter((user) => this.applyFilter(user, this.searchText()))
  );
  listType = input<'wishing' | 'trading'>('wishing');
  searchText = signal('');

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  showFilters = false;

//   onTradingFilter() {}
  onClearTradingFilter(): void {
    this.searchText.set('');
  }

  applyFilter(user: User, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }

    const lowerSearchText = searchText.toLocaleLowerCase();
    const userNameMatches = user.displayName
      .toLocaleLowerCase()
      .includes(lowerSearchText);
    const userIdMatches = user.id.toString().includes(lowerSearchText);
    const userLocationMatches = (user.location || '')
      .toLocaleLowerCase()
      .includes(lowerSearchText);
    const userBioMatches = (user.bio || '')
      .toLocaleLowerCase()
      .includes(lowerSearchText);

    return (
      userNameMatches || userIdMatches || userLocationMatches || userBioMatches
    );
  }
}
