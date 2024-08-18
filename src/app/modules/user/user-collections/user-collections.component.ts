import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription, tap } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Collection, SEOService } from 'src/app/core';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { UserCollectionDetailsComponent } from '../user-collection-details/user-collection-details.component';
import { UserCollectionsListComponent } from './user-collections-list.component';
import { userFeature } from '../store/user.state';
import { authFeature } from '../../auth/store/auth.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,

    MatProgressSpinnerModule,

    UserSummaryComponent,
    UserCollectionsListComponent,
  ],
})
export class UserCollectionsComponent implements OnInit, OnDestroy {
  authUser$ = this.store.select(authFeature.selectUser);
  user$ = this.store.select(userFeature.selectUser);
  collections = this.store.selectSignal(userFeature.selectCollections);

  showEditButton = false;
  isLoaded$ = this.store.select(userFeature.selectIsCollectionsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.loadUserCollections());

    let colSubs = combineLatest([this.user$, this.authUser$])
      .pipe(
        tap(([user, authUser]) => {
          this.SEOSrv.set({
            title: `Colecciones agregadas por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las colecciones agregadas por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });

          if (authUser && authUser.id == user.id) {
            this.showEditButton = true;
          } else {
            this.showEditButton = false;
          }
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(colSubs);
  }

  onOpenDetails(col: Collection) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['user-collection'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      collection: col,
    };
    this.dialog.open(UserCollectionDetailsComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
