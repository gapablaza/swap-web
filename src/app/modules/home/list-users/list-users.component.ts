import { registerLocaleData, NgFor, NgIf, DecimalPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-list-users',
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, LazyLoadImageModule, NgIf, DecimalPipe]
})
export class ListUsersComponent implements OnInit {
  @Input() users: User[] = [] ;
  @Input() type = 'none';
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  showObject = false;

  constructor() { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.showObject = (this.type == 'none') ? false : true;
   }

}
