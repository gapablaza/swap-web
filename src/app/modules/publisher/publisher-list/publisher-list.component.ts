import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import orderBy from 'lodash/orderBy';

import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { AdsModule } from 'src/app/shared/ads.module';
import { AuthService, Publisher, PublisherService } from 'src/app/core';
import { SlugifyPipe, UIService } from 'src/app/shared';


@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    AdsModule,
    NgClass,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    NgFor,
    RouterLink,
    LazyLoadImageModule,
    SlugifyPipe,
  ],
})
export class PublisherListComponent implements OnInit, OnDestroy {
  authUser = this.authSrv.getCurrentUser();
  publishers: Publisher[] = [];
  showedPublishers: Publisher[] = [];

  searchText = '';
  sortOptionSelected = 'collections';
  sortOptions = [
    {
      selectName: 'Nº de colecciones',
      selectValue: 'collections',
      arrayFields: ['collections', 'name'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['name'],
      arrayOrders: ['asc'],
    },
  ];

  showFilters = true;
  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private pubSrv: PublisherService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    let pubSub = this.pubSrv.list()
      .subscribe(pubs => {
        this.publishers = [...pubs];
        this.showedPublishers = [...pubs];
        this.sortShowedPublishers();
        this.isLoaded = true;
        this.cdr.markForCheck();
      })
    this.subs.add(pubSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  trackByPublishers(index: number, item: any): number {
    return item.id;
  }

  onFilter() {
    this.filterShowedPublishers();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedPublishers();
  }

  onSort() {
    this.sortShowedPublishers();
  }

  sortShowedPublishers() {
    let sortParams = this.sortOptions.find(
      (e) => e.selectValue == this.sortOptionSelected
    );
    this.showedPublishers = orderBy(
      [...this.showedPublishers],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );
  }

  filterShowedPublishers() {
    let tempPublishers = this.publishers;
    // let type = parseInt(this.typeSelected);

    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempPublishers = [
        ...this.publishers.filter((elem: Publisher) => {
          return (
            elem.name
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }

    this.showedPublishers = [...tempPublishers.reverse()];
    this.sortShowedPublishers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
