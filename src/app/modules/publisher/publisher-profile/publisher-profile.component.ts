import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { SlugifyPipe, UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { SEOService } from 'src/app/core';
import { publisherFeature } from '../store/publisher.state';
import { publisherActions } from '../store/publisher.actions';
import { PublisherProfileInfoComponent } from './publisher-profile-info.component';

@Component({
  selector: 'app-publisher-profile',
  templateUrl: './publisher-profile.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe, PublisherProfileInfoComponent],
})
export class PublisherProfileComponent implements OnInit, OnDestroy {
  publisher$ = this.store.select(publisherFeature.selectPublisher);
  collections$ = this.store.select(publisherFeature.selectLastCollections);
  isLoaded$ = this.store.select(publisherFeature.selectIsOneLoaded);

  subs: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private SEOSrv: SEOService,
    private uiSrv: UIService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      publisherActions.load({
        publisherId: Number(this.activatedRoute.snapshot.params['publisherId']),
      })
    );

    let pubSub = this.publisher$
      .pipe(
        filter((publisher) => publisher != null),
        tap((resp) => {
          this.SEOSrv.set({
            title: `Detalle para la editorial ${resp?.name} - Intercambia Láminas`,
            description: `Revisa la información que tenemos disponible de la editorial ${resp?.name} y sus colecciones registradas en nuestro catálogo.`,
            url: `${environment.appUrl}/publishers/${
              resp?.id
            }/${new SlugifyPipe().transform(resp?.name)}`,
            isCanonical: true,
          });
        })
      )
      .subscribe();
    this.subs.add(pubSub);
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
