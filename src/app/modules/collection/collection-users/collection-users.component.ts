import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { filter, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { SEOService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { SlugifyPipe } from 'src/app/shared';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { CollectionUsersListComponent } from './collection-users-list.component';
import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    SlugifyPipe,
    CollectionSummaryComponent,
    CollectionUsersListComponent,
  ],
})
export class CollectionUsersComponent implements OnInit, OnDestroy {
  collection$ = this.store.select(collectionFeature.selectCollection);
  users$ = this.store.select(collectionFeature.selectUsers);
  isLoaded$ = this.store.select(collectionFeature.selectIsUsersLoaded);

  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadUsers());

    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          this.SEOSrv.set({
            title: `Usuarios coleccionando ${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Revisa los distintos usuarios que están juntando el álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}/users`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
