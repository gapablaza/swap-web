import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CollectionOnlyService } from './collection-only.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  providers: [CollectionOnlyService],
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private colOnlySrv: CollectionOnlyService,
  ) {}

  ngOnInit(): void {
    this.colOnlySrv.cleanCurrentCollection();
    // this.route.paramMap
    //   .pipe(
    //     switchMap(paramMap => {
    //       this.collectionId = Number(paramMap.get('id'));
    //       return this.colSrv.get(this.collectionId);
    //     })
    //   )
    //   .subscribe(col => {
    //     console.log('from CollectionComponent', col);
    //     this.colOnlySrv.setCurrentCollection(col);
    //     this.collection = col;
    //   });

    // TO DO: Manejar el caso cuando no se encuentre la colección solicitada
    this.route.data.subscribe((data) => {
      this.colOnlySrv.setCurrentCollection(data['collectionData']);
    });
  }

}
