import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, filter, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Media,
  MediaService,
  SEOService,
  User,
  UserService,
} from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';

@Component({
    selector: 'app-user-media',
    templateUrl: './user-media.component.html',
    styleUrls: ['./user-media.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        UserSummaryComponent,
        MatFormFieldModule,
        MatSelectModule,
        NgFor,
        MatOptionModule,
        MatButtonModule,
        MatIconModule,
        NgClass,
        MatInputModule,
        FormsModule,
        LazyLoadImageModule,
        RouterLink,
        DatePipe,
        SlugifyPipe,
    ],
})
export class UserMediaComponent implements OnInit, OnDestroy {
  user: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  medias: Media[] = [];
  showedImages: Media[] = [];

  items: GalleryItem[] = [];
  lightboxRef = this.gallery.ref('lightbox');

  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
  baseFullImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_full_media_wm/${environment.cloudinary.site}/collectionMedia/`;

  searchText = '';
  sortOptionSelected = 'likes';
  sortOptions = [
    {
      selectName: 'Más "Me Gusta"',
      selectValue: 'likes',
      arrayFields: ['totalLikes', 'created'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Últimos subidos',
      selectValue: 'created-',
      arrayFields: ['created'],
      arrayOrders: ['desc'],
    },
    {
      selectName: 'Primeros subidos',
      selectValue: 'created',
      arrayFields: ['created'],
      arrayOrders: ['asc'],
    },
    {
      selectName: 'Descripción',
      selectValue: 'description',
      arrayFields: ['description', 'collection.data.id'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Colección',
      selectValue: 'collection',
      arrayFields: ['collection.data.name'],
      arrayOrders: ['asc'],
    },
  ];
  showFilters = false;
  isAuth = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
    private mediaSrv: MediaService,
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let userSub = this.userOnlySrv.user$
      .pipe(
        filter((user) => user.id != null),
        tap((user) => {
          this.SEOSrv.set({
            title: `Elementos multimedia publicados por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de los elementos multimedia publicados por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
          this.user = user;
        }),
        concatMap((user) => this.userSrv.getMedia(user.id).pipe(take(1)))
      )
      .subscribe((medias) => {
        // new array with only approved images
        this.medias = medias.filter((m) => {
          return m.mediaTypeId == 1 && m.mediaStatusId == 2;
        });
        this.showedImages = [...this.medias];
        this.sortShowedImages();

        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(userSub);

    let authSub = this.authSrv.isAuth.subscribe((auth) => (this.isAuth = auth));
    this.subs.add(authSub);
  }

  toggleLike(item: Media) {
    if (!this.isAuth) {
      this.uiSrv.showError('Debes iniciar sesión para realizar esta acción');
      return;
    }
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    let newStatus = !item.likes;

    this.mediaSrv
      .setLike(item.id, newStatus)
      .pipe(take(1))
      .subscribe({
        next: (message) => {
          item.likes = newStatus;
          item.totalLikes = newStatus
            ? (item.totalLikes || 0) + 1
            : (item.totalLikes || 0) - 1;
          this.uiSrv.showSuccess(message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.log('setLike error: ', error);
          this.uiSrv.showError(error.error.message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  trackByImage(index: number, item: Media): number {
    return item.id;
  }

  onFilter() {
    this.filterShowedImages();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedImages();
  }

  onSort() {
    this.sortShowedImages();
  }

  sortShowedImages() {
    let sortParams = this.sortOptions.find(
      (e) => e.selectValue == this.sortOptionSelected
    );
    this.showedImages = orderBy(
      [...this.showedImages],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );

    this.lightboxRef.setConfig({
      thumb: false,
      loadingError: 'No se pudo cargar la imagen',
      loop: false,
    });
    this.items = [...this.showedImages.map(img => new ImageItem({
      src: `${this.baseFullImageUrl}${img.id}`,
      alt: `${img.description} en ${img.collection?.data.name} de ${img.collection?.data.publisher.data.name}`
    }))];
    this.lightboxRef.load(this.items);
  }

  filterShowedImages() {
    let tempImages = this.medias;

    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempImages = [
        ...this.medias.filter((elem: Media) => {
          return (
            elem.description
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.collection?.data.name
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.collection?.data.id
              .toString()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }

    this.showedImages = [...tempImages];
    this.sortShowedImages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
