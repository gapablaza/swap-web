import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, filter, first, map, Subscription, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import { AuthService, Collection, CollectionService, Media, MediaService } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  styleUrls: ['./collection-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMediaComponent implements OnInit, OnDestroy {
  medias: Media[] = [];
  showedImages: Media[] = [];
  collection: Collection = {} as Collection;
  baseImageUrl =
    'https://res.cloudinary.com/cambialaminas/image/upload/t_il_media_wm/prod/collectionMedia/';

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
      arrayFields: ['description', 'user.data.id'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Usuario',
      selectValue: 'user',
      arrayFields: ['user.data.display'],
      arrayOrders: ['asc'],
    },
  ];
  showFilters = false;
  isAuth = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private mediaSrv: MediaService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter(col => col.id != null),
        tap(col => this.collection = col),
        concatMap((col) => this.colSrv.getMedia(col.id).pipe(first())),
        // filter only approved images
        map((media) =>
          media.filter((elem: Media) => {
            return elem.mediaTypeId == 1 && elem.mediaStatusId == 2;
          })
        )
      )
      .subscribe((data) => {
        console.log('CollectionMediaComponent - Sub colOnlySrv');
        this.medias = [...data];
        this.showedImages = [...data];
        this.sortShowedImages();
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    let authSub = this.authSrv.isAuth.subscribe(auth => this.isAuth = auth);
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
      .pipe(first())
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
            elem.user?.data.displayName
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.user?.data.id
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
