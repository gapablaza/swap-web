import {
  DatePipe,
  DecimalPipe,
  NgClass,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
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

import { Collection, Media } from 'src/app/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
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
    DecimalPipe,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    LightboxModule,

    PaginationComponent,
  ],
})
export class CollectionMediaGridComponent {
  @Output() onToggleLike = new EventEmitter<Media>();
  @Output() onNewImage = new EventEmitter<void>();
  collection = input.required<Collection>();
  images = input.required<Media[]>();

  searchText = signal('');
  sortOptionSelected = signal('likes');
  pageSelected = signal(0);

  items: GalleryItem[] = [];
  lightboxRef = this.gallery.ref('lightbox');
  showFilters = false;
  recordsPerPage = 24;
  baseImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_media_wm/${environment.cloudinary.site}/collectionMedia/`;
  baseFullImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/t_il_full_media_wm/${environment.cloudinary.site}/collectionMedia/`;
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

  managedImages = computed(() => {
    const filterText = this.searchText();
    const sortOption = this.sortOptions.find(
      (option) => option.selectValue === this.sortOptionSelected()
    );

    let filteredImages = this.images().filter((i) =>
      this.applyFilter(i, filterText)
    );

    if (sortOption) {
      filteredImages = orderBy(
        [...filteredImages],
        sortOption.arrayFields,
        sortOption.arrayOrders as ['asc' | 'desc']
      );
    }

    return filteredImages;
  });

  showedImages = computed(() => {
    const page = this.pageSelected();
    const startIndex = (page - 1) * this.recordsPerPage;
    const endIndex = page * this.recordsPerPage;
    const showed = this.managedImages().slice(startIndex, endIndex);

    this.items = [
      ...showed.map(
        (img) =>
          new ImageItem({
            src: `${this.baseFullImageUrl}${img.id}`,
            alt: `${img.description} en ${img.collection?.data.name} de ${img.collection?.data.publisher.data.name}`,
          })
      ),
    ];
    this.lightboxRef.load(this.items);

    return showed;
  });

  lastPage = computed(() => {
    if (this.managedImages().length == 0) {
      return 1;
    }

    return Math.ceil(this.managedImages().length / this.recordsPerPage);
  });

  fromRecord = computed(() => {
    const page = this.pageSelected();
    return Math.min(
      (page - 1) * this.recordsPerPage + 1,
      this.managedImages().length
    );
  });

  toRecord = computed(() => {
    const page = this.pageSelected();
    const endRecord = page * this.recordsPerPage;
    return Math.min(endRecord, this.managedImages().length);
  });

  applyFilter(image: Media, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }

    return (
      image.description
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      image.user?.data.displayName
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      image.user?.data.id.toString().indexOf(searchText.toLocaleLowerCase()) !==
        -1
    );
  }

  onPageChange(page: number) {
    this.pageSelected.set(page);
  }

  constructor(public gallery: Gallery, public lightbox: Lightbox) {
    registerLocaleData(es);

    effect(
      () => {
        this.searchText();
        this.pageSelected.set(1);
      },
      { allowSignalWrites: true }
    );

    this.lightboxRef.setConfig({
      thumb: false,
      loadingError: 'No se pudo cargar la imagen',
      loop: false,
    });
  }
}
