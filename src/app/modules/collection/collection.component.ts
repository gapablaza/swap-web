import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';

import { collectionActions } from './store/collection.actions';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styles: `@import './src/styles/pages/_collection.scss';`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
})
export class CollectionComponent implements OnInit, OnDestroy {
  subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    let routeSub = this.route.paramMap
      .pipe(
        map((paramMap) => {
          let collectionId = paramMap.get('id');
          return +(collectionId || 0);
        })
      )
      .subscribe((collectionId) => {
        this.store.dispatch(collectionActions.loadData({ collectionId }));
      });

    this.subs.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(collectionActions.cleanData());
  }
}
