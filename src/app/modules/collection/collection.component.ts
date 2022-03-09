import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { Collection, CollectionService } from 'src/app/core';
import { CollectionOnlyService } from './collection-only.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  providers: [CollectionOnlyService],
  styleUrls: ['./collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CollectionComponent implements OnInit {
  collectionId: number = 0;
  collection: Collection = {} as Collection;

  constructor(
    private route: ActivatedRoute,
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) {
  }

  ngOnInit(): void {
    this.colOnlySrv.cleanCurrentCollection();
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          this.collectionId = Number(paramMap.get('id'));
          return this.colSrv.get(this.collectionId);
        })
      )
      .subscribe(col => {
        console.log('from CollectionComponent', col);
        this.colOnlySrv.setCurrentCollection(col);
        this.collection = col;
      });
  }

}
