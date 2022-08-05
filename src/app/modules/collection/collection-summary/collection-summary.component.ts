import { Component, Input, OnInit } from '@angular/core';

import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  User,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { filter } from 'rxjs';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  styleUrls: ['./collection-summary.component.scss'],
})
export class CollectionSummaryComponent implements OnInit {
  @Input() showBackButton = false;
  collection: Collection = {} as Collection;
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  isLoaded = false;

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService,
    private uiSrv: UIService,
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
      .pipe(filter((col) => col.id != null))
      .subscribe((col) => {
        this.collection = col;
        this.isLoaded = true;
      });
    console.log('from CollectionSummaryComponent', this.collection);
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }
}
