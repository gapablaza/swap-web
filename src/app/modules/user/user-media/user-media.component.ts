import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subscription, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { DEFAULT_USER_PROFILE_IMG, Media, SEOService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { userFeature } from '../store/user.state';
import { authFeature } from '../../auth/store/auth.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-media',
  templateUrl: './user-media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    NgClass,
    FormsModule,
    RouterLink,
    UserSummaryComponent,
    LazyLoadImageModule,
    DatePipe,
    SlugifyPipe,
    AsyncPipe,
  ],
})
export class UserMediaComponent implements OnInit, OnDestroy {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
  baseFullImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_full_media_wm/${environment.cloudinary.site}/collectionMedia/`;

  user$ = this.store.select(userFeature.selectUser);
  medias$ = this.store
    .select(userFeature.selectMedia)
    .pipe(
      map((medias) =>
        medias.filter((m) => m.mediaTypeId == 1 && m.mediaStatusId == 2)
      )
    );
  medias: Media[] = [];
  showedImages: Media[] = [];

  items: GalleryItem[] = [];
  lightboxRef = this.gallery.ref('lightbox');

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
  isAuth$ = this.store.select(authFeature.selectIsAuth);
  isSaving$ = this.store.select(userFeature.selectIsProcessing);
  isLoaded$ = this.store.select(userFeature.selectIsMediaLoaded);
  showFilters = false;
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.loadUserMedia());

    let mediaSub = combineLatest([this.user$, this.medias$])
      .pipe(
        tap(([user]) => {
          this.SEOSrv.set({
            title: `Elementos multimedia publicados por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de los elementos multimedia publicados por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
        })
      )
      .subscribe(([, medias]) => {
        this.medias = medias;
        this.showedImages = [...this.medias];
        this.sortShowedImages();

        this.cdr.markForCheck();
      });
    this.subs.add(mediaSub);
  }

  toggleLike(item: Media) {
    this.store.dispatch(
      userActions.toggleMediaLike({ mediaId: item.id, likes: !item.likes })
    );
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
    this.items = [
      ...this.showedImages.map(
        (img) =>
          new ImageItem({
            src: `${this.baseFullImageUrl}${img.id}`,
            alt: `${img.description} en ${img.collection?.data.name} de ${img.collection?.data.publisher.data.name}`,
          })
      ),
    ];
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
