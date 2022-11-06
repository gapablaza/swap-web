import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { concatMap, filter, Subscription, take } from 'rxjs';

import {
  AuthService,
  CollectionService,
  TopsCategory,
  User,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-tops',
  templateUrl: './collection-tops.component.html',
  styleUrls: ['./collection-tops.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTopsComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  authUser: User = {} as User;
  topsAvailable = false;
  categories: TopsCategory[] = [];
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
      });
    this.subs.add(authSub);

    // obtiene los datos de la colección
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        concatMap((col) => this.colSrv.getTops(col.id).pipe(take(1)))
      )
      .subscribe({
        next: (tops) => {
          this.categories = tops.categories.sort((a, b) => b.id - a.id);
          this.topsAvailable = tops.available;
          this.isLoaded = true;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.topsAvailable = false;
          this.isLoaded = true;
          this.cdr.markForCheck();
        },
      });
    this.subs.add(colSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
