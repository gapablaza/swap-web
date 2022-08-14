import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserOnlyService } from './user-only.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserOnlyService],
})
export class UserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userOnlySrv: UserOnlyService,
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
    this.route.data.subscribe((data) => {
      this.userOnlySrv.setCurrentUser(data['userData']);
    });
  }

}
