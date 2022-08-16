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
import { filter, first, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  styleUrls: ['./collection-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSummaryComponent implements OnInit, OnDestroy {
  @Input() showBackButton = false;
  collection: Collection = {} as Collection;
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
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
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        console.log('CollectionSummaryComponent - Sub authSrv');
        this.authUser = user;
      });
    this.subs.add(authSub);

    // obtiene los datos de la colección
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        first(),
      )
      .subscribe((col) => {
        console.log('CollectionSummaryComponent - Sub colOnlySrv');
        this.collection = col;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
