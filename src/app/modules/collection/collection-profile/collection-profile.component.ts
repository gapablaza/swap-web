import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, first } from 'rxjs';

import {
  AuthService,
  Collection,
  CollectionService,
  DEFAULT_COLLECTION_IMG,
  Item,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  styleUrls: ['./collection-profile.component.scss'],
})
export class CollectionProfileComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  collection: Collection = {} as Collection;
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isSaving = false;
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private dialog: MatDialog,
    private uiSrv: UIService,
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // get possible auth User
    this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
      });

    // obtiene los datos de la colección
    this.colOnlySrv.collection$
      .pipe(filter((col) => col.id != null))
      .subscribe((col) => {
        this.collection = col;
        this.isLoaded = true;

        // si el usuario tiene esta colección se obtienen sus listas
        if (this.collection.collecting) {
          this.colSrv
            .getItems(this.collection.id)
            .pipe(first())
            .subscribe((items) => {
              items.forEach((item) => {
                if (item.wishlist) {
                  this.userWishing.push(item);
                }
                if (item.tradelist) {
                  this.userTrading.push(item);
                }
              });
            });
        }
      });
    console.log('from CollectionProfileComponent');
  }

  onAdd() {
    this.isSaving = true;
    this.colSrv.add(this.collection.id)
      .subscribe(resp => {
        this.collection.collecting = true;
        this.isSaving = false;
        this.uiSrv.showSuccess(resp);
      })
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  onComplete(completed: boolean) {
    this.isSaving = true;
    this.colSrv.setCompleted(this.collection.id, completed)
      .subscribe(resp => {
        this.collection.completed = completed;
        this.uiSrv.showSuccess(resp);
        this.isSaving = false;
      })
  }

  onDelete() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.isSaving = true;
    this.colSrv.remove(this.collection.id)
      .subscribe(resp => {
        this.collection.collecting = false;
        this.uiSrv.showSuccess(resp);
        this.dialog.closeAll();
        this.isSaving = false;
      })
  }
}
