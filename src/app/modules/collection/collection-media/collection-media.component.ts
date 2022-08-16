import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, filter, first, map, Subscription } from 'rxjs';
import { orderBy } from 'lodash';

import { CollectionService, Media } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  styleUrls: ['./collection-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMediaComponent implements OnInit, OnDestroy {
  medias: Media[] = [];
  showedImages: Media[] = [];
  baseImageUrl =
    'https://res.cloudinary.com/cambialaminas/image/upload/c_scale,q_auto,h_280/c_scale,e_grayscale,g_south_east,l_base:icono-logo-watermark-white,o_40,w_35,x_5,y_5/v1/prod/collectionMedia/';
  
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
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter(col => col.id != null),
        concatMap((col) => this.colSrv.getMedia(col.id).pipe(first())),
        // filter only approved images
        map(media => media.filter((elem: Media) => {
          return elem.mediaTypeId == 1 && elem.mediaStatusId == 2;
        })),
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
