import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, filter, map, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  AuthService,
  Collection,
  CollectionService,
  Media,
  MediaService,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { UIService } from 'src/app/shared';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CollectionMediaUploadComponent } from '../collection-media-upload/collection-media-upload.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  styleUrls: ['./collection-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMediaComponent implements OnInit, OnDestroy {
  medias: Media[] = [];
  showedImages: Media[] = [];
  imagesForModeration: Media[] = [];
  collection: Collection = {} as Collection;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
  baseForModImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/v1/${environment.cloudinary.site}/collectionMedia/`;

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
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        tap((col) => (this.collection = col)),
        concatMap((col) => this.colSrv.getMedia(col.id).pipe(take(1))),
        // filter only approved images
        map((media) =>
          media.filter((elem: Media) => {
            return elem.mediaTypeId == 1 && elem.mediaStatusId == 2;
          })
        )
      )
      .subscribe((data) => {
        this.medias = [...data];
        this.showedImages = [...data];
        this.sortShowedImages();
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    let authSub = this.authSrv.isAuth.subscribe((auth) => {
      this.isAuth = auth;
      if (auth) {
        this.mediaSrv
          .listForModerationByUser()
          .pipe(
            filter(() => this.isAuth),
            // filter only images
            map((media) =>
              media.filter((elem: Media) => {
                return elem.mediaTypeId == 1;
              })
            ),
            take(1)
          )
          .subscribe((media) => {
            this.imagesForModeration = media;
            this.cdr.markForCheck();
          });
      } else {
        this.imagesForModeration = [];
      }
    });
    this.subs.add(authSub);
  }

  onNewImage() {
    if (!this.isAuth) {
      this.uiSrv.showError('Inicia sesión para subir elementos multimedia!');
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['media-image'];
    dialogConfig.width = '375px';
    dialogConfig.data = {
      collectionId: this.collection.id,
    };
    // dialogConfig.maxWidth = '500px';

    const dialogRef = this.dialog.open(
      CollectionMediaUploadComponent,
      dialogConfig
    );
    let dialogSub = dialogRef.afterClosed().subscribe((data) => {
      if (data && data.id) {
        this.imagesForModeration.push({
          created: data.created,
          description: data.description,
          id: data.id,
          mediaStatusId: 1,
          mediaStatusName: 'Por confirmar',
          mediaTypeId: 1,
          mediaTypeName: 'Imagen',
        });
        this.cdr.markForCheck();
      }
    });
    this.subs.add(dialogSub);
  }

  onDeleteImage(id: number) {
    if (!id || isNaN(id)) return;

    this.isSaving = true;
    this.mediaSrv
      .delete(id)
      .pipe(take(1))
      .subscribe({
        next: (message) => {
          this.imagesForModeration.splice(
            this.imagesForModeration.findIndex((elem) => {
              return elem.id == id;
            }),
            1
          );
          this.uiSrv.showSuccess(message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.log('delete error: ', error);
          this.uiSrv.showError(error.error.message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
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
