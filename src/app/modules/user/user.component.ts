import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { User, UserService } from 'src/app/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userId: number = 0;
  user: User = {} as User;

  constructor(
    private route: ActivatedRoute,
    private userSrv: UserService,
  ) { }

  ngOnInit(): void {
    // this.colOnlySrv.cleanCurrentCollection();
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          this.userId = Number(paramMap.get('id'));
          return this.userSrv.get(this.userId);
        })
      )
      .subscribe(user => {
        console.log('from UserComponent', user);
        // this.colOnlySrv.setCurrentCollection(col);
        this.user = user;
      });
  }

}
