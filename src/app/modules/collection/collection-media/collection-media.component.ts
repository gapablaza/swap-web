import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { concatMap, filter, map, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {
  AuthService,
  Collection,
  CollectionService,
  Media,
  MediaService,
  SEOService,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { environment } from 'src/environments/environment';
import { SlugifyPipe, UIService } from 'src/app/shared';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { CollectionMediaUploadComponent } from '../collection-media-upload/collection-media-upload.component';
import { Store } from '@ngrx/store';
import { collectionFeature } from '../store/collection.state';
import { CollectionMediaGridComponent } from './collection-media-grid.component';
import { collectionActions } from '../store/collection.actions';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    CollectionSummaryComponent,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgClass,
    MatInputModule,
    FormsModule,
    LazyLoadImageModule,
    RouterLink,
    DatePipe,
    AsyncPipe,
    CollectionMediaGridComponent,
  ],
})
export class CollectionMediaComponent implements OnInit, OnDestroy {
  medias$ = this.store.select(collectionFeature.selectMedia);
  collection$ = this.store.select(collectionFeature.selectCollection);
  isLoaded$ = this.store.select(collectionFeature.selectIsMediaLoaded);
  isProcessing$ = this.store.select(collectionFeature.selectIsProcessing);

  medias: Media[] = [];
  showedImages: Media[] = [];
  imagesForModeration: Media[] = [];

  items: GalleryItem[] = [];
  lightboxRef = this.gallery.ref('lightbox');

  collection: Collection = {} as Collection;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
  baseFullImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_full_media_wm/${environment.cloudinary.site}/collectionMedia/`;
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
    private store: Store,
    private SEOSrv: SEOService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private uiSrv: UIService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadMedia());
    
    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          // this.collection = col;

          this.SEOSrv.set({
            title: `Media compartida asociada a ${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Revisa los distintos elementos multimedia subidos por los usuarios, asociados al álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}/media`,
            isCanonical: true,
          });
        }),
        // concatMap((col) => this.colSrv.getMedia(col.id).pipe(take(1))),
        // // filter only approved images
        // map((media) =>
        //   media.filter((elem: Media) => {
        //     return elem.mediaTypeId == 1 && elem.mediaStatusId == 2;
        //   })
        // )
      )
      .subscribe((data) => {
        // this.medias = [...data];
        // this.showedImages = [...data];
        // this.sortShowedImages();

        // this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    // let authSub = this.authSrv.isAuth.subscribe((auth) => {
    //   this.isAuth = auth;
    //   if (auth) {
    //     this.mediaSrv
    //       .listForModerationByUser()
    //       .pipe(
    //         filter(() => this.isAuth),
    //         // filter only images
    //         map((media) =>
    //           media.filter((elem: Media) => {
    //             return (
    //               elem.mediaTypeId == 1 &&
    //               elem.collection?.data.id == this.collection.id
    //             );
    //           })
    //         ),
    //         take(1)
    //       )
    //       .subscribe((media) => {
    //         this.imagesForModeration = media;
    //         this.cdr.markForCheck();
    //       });
    //   } else {
    //     this.imagesForModeration = [];
    //   }
    // });
    // this.subs.add(authSub);
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

    // this.lightboxRef.reset();
    // this.lightboxRef.setConfig({
    //   imageSize: 'contain',
    //   thumb: false,
    //   itemTemplate: this.itemTemplate
    // });

    // this.showedImages.forEach(img => {
    //   this.lightboxRef.addImage({
    //     src: `${this.baseImageUrl}${img.id}`, // TO DO: Full image with wm
    //     // thumb: `${this.baseImageUrl}${img.id}.jpg`,
    //     text: 'Prueba de texto',
    //   });
    // })

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
            alt: `${img.description} en ${this.collection.name} de ${this.collection.publisher.data.name}`,
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
