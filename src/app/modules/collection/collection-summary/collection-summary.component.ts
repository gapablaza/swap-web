import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { ShareUrlComponent } from 'src/app/shared/components/share-url/share-url.component';

@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  styleUrls: ['./collection-summary.component.scss']
})
export class CollectionSummaryComponent implements OnInit {
  @Input() showBackButton = false;
  collection: Collection = {} as Collection;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  isLoaded = false;

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    this.colOnlySrv.collection$.subscribe((col) => {
      if (col.id) {
        this.collection = col;
        this.isLoaded = true;
      }
    });
    console.log('from CollectionSummaryComponent', this.collection);
  }

  onShare(): void {
    this.bottomSheet.open(ShareUrlComponent);
  }
}
