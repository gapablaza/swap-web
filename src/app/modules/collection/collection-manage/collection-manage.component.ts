import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';

import { Collection } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-manage',
  templateUrl: './collection-manage.component.html',
  styleUrls: ['./collection-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionManageComponent implements OnInit, OnDestroy {
  collection: Collection = {} as Collection;
  totalWishing: number = 0;
  totalTrading: number = 0;
  actualPage = '';
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        tap((col) => {
          if (!col.userData?.collecting) {
            this.uiSrv.showError('Aún no tienes agregada esta colección');
            this.router.navigate(['../'], {
              relativeTo: this.route,
            });
          }
        }),
        filter((col) => (col.userData?.collecting ? true : false))
      )
      .subscribe((col) => {
        console.log('CollectionManageComponent - Sub colOnlySrv');
        this.collection = col;
        this.totalWishing = col.userData?.wishing || 0;
        this.totalTrading = col.userData?.trading || 0;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    this.actualPage = this.router.url.split('/').pop() || '';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((data: any) => {
        this.actualPage = data.url.split('/').pop() || '';
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
