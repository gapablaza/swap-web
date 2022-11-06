import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subscription, switchMap, take, tap } from 'rxjs';

import {
  AuthService,
  Collection,
  CollectionService,
  DEFAULT_COLLECTION_IMG,
  Item,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  styleUrls: ['./collection-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProfileComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  collection: Collection = {} as Collection;
  items: Item[] = [];
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isAdsLoaded = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(
        tap((user) => {
          if(!user.id || (user.accountTypeId == 1)) {
            this.loadAds();
          }
        }),
        filter((user) => user.id != null)
      )
      .subscribe((user) => {
        console.log('CollectionProfileComponent - Sub authSrv');
        this.authUser = user;
      });
    this.subs.add(authSub);

    // obtiene los datos de la colección
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        tap((col) => {
          this.collection = col;
          this.isLoaded = true;
          this.cdr.markForCheck();
        }),
        // si el usuario tiene esta colección se obtienen sus listas
        filter(
          (col) =>
            (col.userData?.collecting ? true : false) && this.items.length == 0
        ),
        switchMap((col) => {
          return this.colSrv.getItems(col.id).pipe(take(1));
        })
      )
      .subscribe((items) => {
        console.log('CollectionProfileComponent - Sub colOnlySrv');
        this.items = items;
        items.forEach((item) => {
          if (item.wishlist) {
            this.userWishing.push(item);
          }
          if (item.tradelist) {
            this.userTrading.push(item);
          }
        });
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
      this.cdr.markForCheck();
    })
  }

  onAdd() {
    this.isSaving = true;
    this.colSrv
      .add(this.collection.id)
      .pipe(take(1))
      .subscribe((resp) => {
        this.collection.userData = {
          collecting: true,
          completed: false,
          wishing: 0,
          trading: 0,
        };
        this.colOnlySrv.setCurrentCollection(this.collection);
        this.isSaving = false;
        this.uiSrv.showSuccess(resp);
      });
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  onComplete(completed: boolean) {
    this.isSaving = true;
    this.colSrv
      .setCompleted(this.collection.id, completed)
      .pipe(take(1))
      .subscribe((resp) => {
        this.collection.userData = {
          ...this.collection.userData,
          collecting: true,
          completed,
        };
        this.colOnlySrv.setCurrentCollection(this.collection);
        this.uiSrv.showSuccess(resp);
        this.isSaving = false;
      });
  }

  onDelete() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.isSaving = true;
    this.colSrv
      .remove(this.collection.id)
      .pipe(take(1))
      .subscribe((resp) => {
        this.collection.userData = {
          collecting: false,
        };
        this.colOnlySrv.setCurrentCollection(this.collection);
        this.uiSrv.showSuccess(resp);
        this.dialog.closeAll();
        this.isSaving = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
