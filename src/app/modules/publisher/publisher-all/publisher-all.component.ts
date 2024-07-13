import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { publisherFeature } from '../store/publisher.state';
import { publisherActions } from '../store/publisher.actions';
import { PublisherAllListComponent } from './publisher-all-list.component';

@Component({
  selector: 'app-publisher-all',
  templateUrl: './publisher-all.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe, PublisherAllListComponent],
})
export class PublisherAllComponent implements OnInit {
  publishers$ = this.store.select(publisherFeature.selectPublishers);
  isLoaded$ = this.store.select(publisherFeature.selectIsAllLoaded);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(publisherActions.loadAll());
  }
}
