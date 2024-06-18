import {
  registerLocaleData,
  NgClass,
  DecimalPipe,
  DatePipe,
  AsyncPipe,
} from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { combineLatest, filter, map, Subscription, tap } from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Store } from '@ngrx/store';

import {
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  SEOService,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { DaysSinceLoginDirective } from '../../../shared/directives/days-since-login.directive';
import { ReportComponent } from 'src/app/shared/components/report/report.component';
import { authFeature } from '../../auth/store/auth.state';
import { userFeature } from '../store/user.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LazyLoadImageModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    DaysSinceLoginDirective,
    MatExpansionModule,
    NgClass,
    MatDialogModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    DatePipe,
    SanitizeHtmlPipe,
    SlugifyPipe,
    AsyncPipe,
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  isAuth$ = this.store.select(authFeature.selectIsAuth);
  user$ = this.store.select(userFeature.selectUser);
  authUser$ = this.store.select(authFeature.selectUser);

  showTrades$ = this.store.select(userFeature.selectTradesShow);
  trades$ = this.store
    .select(userFeature.selectTradesCollections)
    .pipe(
      map((cols) =>
        [...cols].sort((a, b) =>
          a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
        )
      )
    );
  possibleTrades$ = this.store.select(userFeature.selectTradesTotal);

  isSameUser = false;
  isProcessing$ = this.store.select(userFeature.selectIsProcessing);
  isLoaded$ = this.store.select(userFeature.selectIsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    let dataSub = combineLatest([
      this.authUser$, 
      this.user$,
      this.isLoaded$,
    ])
      .pipe(
        // filter(([, user]) => user.id != null),
        filter(([,,isLoaded]) => isLoaded),
        tap(([authUser, user]) => {
          this.SEOSrv.set({
            title: `Perfil de ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el resumen de las colecciones, evaluaciones recibidas y media publicada de ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });

          this.store.dispatch(userActions.loadTradesWithAuthUser());

          if (authUser.id && authUser.id === user.id) {
            this.isSameUser = true;
          } else {
            this.isSameUser = false;
          }
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(dataSub);
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  onShowConfirm(): void {
    this.dialog.open(this.confirmDialog, { disableClose: true });
  }

  onShowReportDialog(userId: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['report-dialog'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      objectTypeId: 7,
      objectId: userId,
    };
    this.dialog.open(ReportComponent, dialogConfig);
  }

  toggleBlacklist(blacklist: boolean): void {
    this.store.dispatch(userActions.toggleBlacklist({ blacklist }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
