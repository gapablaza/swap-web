import { Component, OnInit } from '@angular/core';
import { Collection, SearchService, User, UserService } from 'src/app/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
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
      console.log(data);
      this.added = data.added;
      this.moreItems = data.moreItems;
      this.moreMedia = data.moreMedia;
      this.popular = data.popular;
      this.published = data.published;
      this.users = data.users;
    });
  }

  test() {

  }

}
