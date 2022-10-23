import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, filter, first, Subscription, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Media,
  MediaService,
  User,
  UserService,
} from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-media',
  templateUrl: './user-media.component.html',
  styleUrls: ['./user-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMediaComponent implements OnInit, OnDestroy {
  user: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  medias: Media[] = [];
  showedImages: Media[] = [];
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;

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
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let userSub = this.userOnlySrv.user$
      .pipe(
        filter((user) => user.id != null),
        tap((user) => (this.user = user)),
        concatMap((user) => this.userSrv.getMedia(user.id))
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

    // Load items into gallery
    // const galleryRef = this.gallery.ref(this.galleryId);
    // galleryRef.load(this.galleryItems);
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
