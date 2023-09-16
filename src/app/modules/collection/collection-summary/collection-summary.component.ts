import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  User,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { filter, Subscription, take, tap } from 'rxjs';
import { UIService } from 'src/app/shared';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-collection-summary',
    templateUrl: './collection-summary.component.html',
    styleUrls: ['./collection-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        LazyLoadImageModule,
    ],
})
export class CollectionSummaryComponent implements OnInit, OnDestroy {
  @Input() showBackButton = false;
  collection: Collection = {} as Collection;
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  // isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(
        // tap((user) => {
        //   if(!user.id || (user.accountTypeId == 1)) {
        //     this.loadAds();
        //   }
        // }),
        filter((user) => user.id != null)
      )
      .subscribe((user) => {
        this.authUser = user;
      });
    this.subs.add(authSub);

    // obtiene los datos de la colección
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        take(1),
      )
      .subscribe((col) => {
        this.collection = col;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  // loadAds() {
  //   this.uiSrv.loadAds().then(() => {
  //     this.isAdsLoaded = true;
  //     this.cdr.markForCheck();
  //   })
  // }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
