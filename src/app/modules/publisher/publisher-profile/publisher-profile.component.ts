import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, filter, tap } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MarkdownPipe, SanitizeHtmlPipe, SlugifyPipe, UIService } from 'src/app/shared';
import { AdsModule } from 'src/app/shared/ads.module';
import { environment } from 'src/environments/environment';
import { CollectionItemComponent } from 'src/app/shared/components/collection-item/collection-item.component';
import {
  AuthService,
  Collection,
  Publisher,
  PublisherService,
  SEOService,
  User,
} from 'src/app/core';

@Component({
  selector: 'app-publisher-profile',
  templateUrl: './publisher-profile.component.html',
  styleUrls: ['./publisher-profile.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    AdsModule,
    NgFor,
    CollectionItemComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SanitizeHtmlPipe,
    MarkdownPipe,
  ],
})
export class PublisherProfileComponent implements OnInit, OnDestroy {
  publisher: Publisher = {} as Publisher;
  collections: Collection[] = [];
  authUser = this.authSrv.getCurrentUser();

  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authSrv: AuthService,
    private pubSrv: PublisherService,
    private SEOSrv: SEOService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    // get possible auth User
    // let authSub = this.authSrv.authUser
    //   .pipe(
    //     tap((user) => {
    //       if (!user.id || user.accountTypeId == 1) {
    //         this.loadAds();
    //       }
    //     }),
    //     filter((user) => user.id != null)
    //   )
    //   .subscribe((user) => {
    //     this.authUser = user;
    //   });
    // this.subs.add(authSub);

    let pubSub = this.pubSrv
      .get(Number(this.activatedRoute.snapshot.params['publisherId']))
      .pipe(
        tap((resp) => {
          this.SEOSrv.set({
            title: `Detalle para la editorial ${resp.data.name} (${
              resp.data.collections || 0
            } colecciones) - Intercambia Láminas`,
            description: `Revisa la información que tenemos disponible de la editorial ${
              resp.data.name
            } con ${
              resp.data.collections || 0
            } colecciones registradas en nuestro catálogo.`,
            url: `${environment.appUrl}/publishers/${
              resp.data.id
            }/${new SlugifyPipe().transform(resp.data.name)}`,
            isCanonical: true,
          });
        })
      )
      .subscribe((resp) => {
        this.publisher = resp.data;
        this.collections = resp.lastCollections;
        this.isLoaded = true;
      });
    this.subs.add(pubSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
