import { registerLocaleData, DecimalPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink, 
  ],
})
export class ListUsersComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() type = 'none';
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  showObject = false;

  ngOnInit(): void {
    registerLocaleData(es);
    this.showObject = this.type == 'none' ? false : true;
  }
}
