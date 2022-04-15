import { Component, OnInit } from '@angular/core';
import { SearchService, UserService } from 'src/app/core';
import { Collection, User } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // user: User = {} as User;
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
      this.added = data.added
        .sort((a, b) => {
          return a.id < b.id ? 1 : -1; 
        });

      this.moreItems = data.moreItems;
      this.moreMedia = data.moreMedia;

      this.popular = data.popular
        .sort((a, b) => {
          return (a.recentCollecting || 0) < (b.recentCollecting || 0) ? 1 : -1; 
        });

      this.published = data.published
        .sort((a, b) => {
          return a.release < b.release ? 1 : -1; 
        });
        
      this.users = data.users;
    });
  }

}
