import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { orderBy } from 'lodash-es';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Collection, Media } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collection-media-grid',
  templateUrl: './collection-media-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    LazyLoadImageModule,
    LightboxModule,
  ],
})
export class CollectionMediaGridComponent implements OnInit, OnChanges {
  @Input() collection!: Collection;
  @Input() media: Media[] = [];
  @Input() isProcessing = false;
  @Output() onToggleLike = new EventEmitter<Media>();
  @Output() onNewImage = new EventEmitter<void>();

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

  constructor(public gallery: Gallery, public lightbox: Lightbox) {}

  ngOnInit(): void {
    this.updateShowedImages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['media']) {
      this.updateShowedImages();
    }
  }

  updateShowedImages(): void {
    this.showedImages = [...this.media];
    this.sortShowedImages();
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
            alt: `${img.description} en ${this.collection.name} de ${this.collection.publisher.data.name}`,
          })
      ),
    ];
    this.lightboxRef.load(this.items);
  }

  onFilter() {
    this.filterShowedImages();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedImages();
  }

  filterShowedImages() {
    let tempImages = this.media;

    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempImages = [
        ...this.media.filter((elem: Media) => {
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
}
