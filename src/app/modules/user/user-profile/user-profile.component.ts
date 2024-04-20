import {
  registerLocaleData,
  NgIf,
  NgFor,
  NgClass,
  DecimalPipe,
  DatePipe,
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
import {
  combineLatest,
  filter,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {
  AuthService,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  SEOService,
  TradesWithUserCollection,
  User,
  UserService,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { UserOnlyService } from '../user-only.service';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { DaysSinceLoginDirective } from '../../../shared/directives/days-since-login.directive';
import { ReportComponent } from 'src/app/shared/components/report/report.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    LazyLoadImageModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    DaysSinceLoginDirective,
    MatExpansionModule,
    NgFor,
    NgClass,
    MatDialogModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    DatePipe,
    SanitizeHtmlPipe,
    SlugifyPipe,
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  user: User = {} as User;
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  trades: TradesWithUserCollection[] = [];
  possibleTrades = 0;
  showTrades = false;
  // isAdsLoaded = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private userOnlySrv: UserOnlyService,
    private userSrv: UserService,
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    this.user = this.userOnlySrv.getCurrentUser();
    this.SEOSrv.set({
      title: `Perfil de ${this.user.displayName} (ID ${this.user.id}) - Intercambia Láminas`,
      description: `Revisa el resumen de las colecciones, evaluaciones recibidas y media publicada de ${this.user.displayName} (ID ${this.user.id}).`,
      isCanonical: true,
    });

    let dataSub = combineLatest([
      this.authSrv.authUser,
      this.userSrv.getMedia(this.user.id),
    ])
      .pipe(
        tap(([authUser, media]) => {
          this.authUser = authUser;
          this.user.contributions = media.filter((m) => {
            return m.mediaTypeId == 1 && m.mediaStatusId == 2;
          }).length;

          // if (!authUser.id || authUser.accountTypeId == 1) {
          //   this.loadAds();
          // }

          this.showTrades = false;

          if (
            authUser.id &&
            authUser.accountTypeId == 2 &&
            authUser.id != this.user.id
          ) {
            this.isLoaded = false;
          } else {
            this.isLoaded = true;
            this.cdr.markForCheck();
          }
        }),
        // Se buscan los posibles cambios con el usuario consultado, si:
        // 1.- Está autenticado
        // 2.- Es PRO
        // 3.- No es el usuario que se está consultando
        filter(
          ([authUser, media]) =>
            authUser.accountTypeId == 2 && authUser.id != this.user.id
        ),
        switchMap(() =>
          this.userSrv.getTradesWithAuthUser(this.user.id).pipe(take(1))
        )
      )
      .subscribe((trades) => {
        if (trades.showTrades) {
          this.trades = trades.collections.sort((a, b) =>
            a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
          );
          this.possibleTrades = trades.total;
          this.showTrades = true;
        }
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(dataSub);
  }

  // loadAds() {
  //   this.uiSrv.loadAds().then(() => {
  //     this.isAdsLoaded = true;
  //     this.cdr.markForCheck();
  //   });
  // }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  onShowConfirm(): void {
    this.dialog.open(this.confirmDialog, { disableClose: true });
  }

  onShowReportDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['report-dialog'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';

    dialogConfig.data = {
      objectTypeId: 7,
      objectId: this.user.id,
    };

    this.dialog.open(ReportComponent, dialogConfig);
  }

  toggleBlacklist(toggle: boolean): void {
    this.isSaving = true;
    if (toggle) {
      this.authSrv
        .addToBlacklist(this.user.id)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            this.user.inBlacklist = true;
            this.userOnlySrv.setCurrentUser(this.user);
            this.uiSrv.showSuccess(resp);
            this.dialog.closeAll();
            this.isSaving = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.log('addToBlacklist', err);
            this.isSaving = false;
          },
        });
    } else {
      this.authSrv
        .removeFromBlacklist(this.user.id)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            this.user.inBlacklist = false;
            this.userOnlySrv.setCurrentUser(this.user);
            this.uiSrv.showSuccess(resp);
            this.isSaving = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.log('removeFromBlacklist', err);
            this.isSaving = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
