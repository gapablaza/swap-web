import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { concatMap, filter } from 'rxjs';
import {
  AuthService,
  Collection,
  CollectionService,
  Tops,
  TopsCategory,
  User,
} from 'src/app/core';

import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-tops',
  templateUrl: './collection-tops.component.html',
  styleUrls: ['./collection-tops.component.scss'],
})
export class CollectionTopsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  authUser: User = {} as User;
  collection: Collection = {} as Collection;
  topsAvailable = false;
  categories: TopsCategory[] = [];
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    // get possible auth User
    this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
      });

    // obtiene los datos de la colección
    this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        concatMap((col) => {
          this.collection = col;
          return this.colSrv.getTops(col.id);
        })
      )
      .subscribe({
        next: (tops) => {
          this.categories = tops.categories.sort((a, b) => b.id - a.id);
          this.topsAvailable = tops.available;
          this.isLoaded = true;
        },
        error: (err) => {
          this.topsAvailable = false;
          this.isLoaded = true;
        },
      });
  }
}
