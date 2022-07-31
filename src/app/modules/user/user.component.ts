import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { User, UserService } from 'src/app/core';
import { UserOnlyService } from './user-only.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserOnlyService],
})
export class UserComponent implements OnInit {
  userId: number = 0;
  user: User = {} as User;

  constructor(
    private route: ActivatedRoute,
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userOnlySrv.cleanCurrentUser();
    // this.route.paramMap
    //   .pipe(
    //     switchMap(paramMap => {
    //       this.userId = Number(paramMap.get('id'));
    //       return this.userSrv.get(this.userId);
    //     })
    //   )
    //   .subscribe(user => {
    //     console.log('from UserComponent Sub', user);
    //     this.userOnlySrv.setCurrentUser(user);
    //     this.user = user;
    //   });

    // TO DO: Manejar el caso cuando no se encuentre el usuario solicitado
    this.activatedRoute.data.subscribe((data) => {
      this.userOnlySrv.setCurrentUser(data['userData']);
    });
  }

}
