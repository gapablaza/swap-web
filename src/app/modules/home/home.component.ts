import { Component, OnInit } from '@angular/core';
import { SearchService, UserService } from 'src/app/core';
import { Collection, User } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User = {} as User;
  added: Collection[] = [];
  moreItems: User[] = [];
  moreMedia: User[] = [];
  popular: Collection[] = [];
  published: Collection[] = [];
  users: User[] = [];

  constructor(
    private userSrv: UserService,
    private searchSrv: SearchService,
  ) { }

  ngOnInit(): void {
    // this.userSrv.get(1).subscribe(data => {
    //   this.user = data;
    //   console.log(this.user);
    // });

    this.searchSrv.getHomeData().subscribe(data => {
      this.added = data.added;
      this.moreItems = data.moreItems;
      this.moreMedia = data.moreMedia;
      this.popular = data.popular;
      this.published = data.published;
      this.users = data.users;
    });
  }

}
