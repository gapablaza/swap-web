import { registerLocaleData, NgIf, NgFor } from '@angular/common';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter, Subscription, switchMap, take, tap } from 'rxjs';

import {
  AuthService,
  Collection,
  CollectionService,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  Item,
  Media,
  SEOService,
  User,
} from 'src/app/core';
import { MarkdownPipe, SlugifyPipe, UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { CollectionOnlyService } from '../collection-only.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
    selector: 'app-collection-profile',
    templateUrl: './collection-profile.component.html',
    styleUrls: ['./collection-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        LazyLoadImageModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatMenuModule,
        MatExpansionModule,
        NgFor,
        MatDialogModule,
        MatProgressSpinnerModule,
        SanitizeHtmlPipe,
        SlugifyPipe,
        MarkdownPipe,
    ],
})
export class CollectionProfileComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  collection: Collection = {} as Collection;
  lastCollectors: User[] = [];
  lastMedia: Media[] = [];
  items: Item[] = [];
  authUser: User = {} as User;

  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;

  userWishing: Item[] = [];
  userTrading: Item[] = [];
  // isAdsLoaded = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(
        // tap((user) => {
        //   if (!user.id || user.accountTypeId == 1) {
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
        tap((col) => {
          this.collection = col;

          this.SEOSrv.set({
            title: `${col.name} - ${col.publisher.data.name} (${col.year}) - Intercambia Láminas`,
            description: `Marca tus repetidas/faltantes del álbum/colección ${col.name} de ${col.publisher.data.name} (${col.year}) para encontrar con quien poder cambiar. Son ${col.items} ítems a coleccionar (láminas / stickers / figuritas / pegatinas / cromos / estampas / barajitas).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col.name + ' ' + col.publisher.data.name
            )}/${col.id}`,
            isCanonical: true,
          });

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

    // obtiene los datos adicionales de la colección
    let parentRouteSub = this.route.parent?.data.subscribe((data) => {
      this.lastCollectors = data['collectionData']['lastCollectors'];
      this.lastMedia = data['collectionData']['lastMedia'];
    });
    this.subs.add(parentRouteSub);
  }

  // loadAds() {
  //   this.uiSrv.loadAds().then(() => {
  //     this.isAdsLoaded = true;
  //     this.cdr.markForCheck();
  //   });
  // }

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
