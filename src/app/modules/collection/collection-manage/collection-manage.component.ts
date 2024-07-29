import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared';
import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { CollectionManageFormComponent } from './collection-manage-form.component';

@Component({
  selector: 'app-collection-manage',
  templateUrl: './collection-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    AsyncPipe,

    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,

    CollectionSummaryComponent,
    CollectionManageFormComponent,
  ],
})
export class CollectionManageComponent implements OnInit, OnDestroy {
  collection$ = this.store.select(collectionFeature.selectCollection);
  isLoaded$ = this.store.select(collectionFeature.selectIsLoaded);
  isProcessing$ = this.store.select(collectionFeature.selectIsProcessing);

  totalWishing: number = 0;
  totalTrading: number = 0;
  actualPage = '';
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          if (!col?.userData?.collecting) {
            this.uiSrv.showError('Aún no tienes agregada esta colección');
            this.router.navigate(['../'], {
              relativeTo: this.route,
            });
          }
        })
      )
      .subscribe((col) => {
        this.totalWishing = col?.userData?.wishing || 0;
        this.totalTrading = col?.userData?.trading || 0;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    this.actualPage = this.router.url.split('/').pop() || '';
    let routeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((data: any) => {
        this.actualPage = data.url.split('/').pop() || '';
      });
    this.subs.add(routeSub);
  }

  addComment(comment: string) {
    this.store.dispatch(
      collectionActions.addComment({ publicComment: comment })
    );
  }

  deleteComment() {
    this.store.dispatch(collectionActions.removeComment());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
