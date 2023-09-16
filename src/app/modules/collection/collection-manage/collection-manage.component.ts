import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subscription, take, tap } from 'rxjs';

import {
  AuthService,
  Collection,
  CollectionService,
  CollectionUserData,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AdsModule } from 'src/app/shared/ads.module';

@Component({
    selector: 'app-collection-manage',
    templateUrl: './collection-manage.component.html',
    styleUrls: ['./collection-manage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        CollectionSummaryComponent,
        AdsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        RouterLink,
        RouterOutlet,
    ],
})
export class CollectionManageComponent implements OnInit, OnDestroy {
  commentForm!: FormGroup;
  collection: Collection = {} as Collection;
  authUser = this.authSrv.getCurrentUser();
  totalWishing: number = 0;
  totalTrading: number = 0;
  actualPage = '';
  isAdsLoaded = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private colSrv: CollectionService,
    private authSrv: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        tap((col) => {
          if (!col.userData?.collecting) {
            this.uiSrv.showError('Aún no tienes agregada esta colección');
            this.router.navigate(['../'], {
              relativeTo: this.route,
            });
          }
        }),
        filter((col) => (col.userData?.collecting ? true : false)),
        tap((col) => {
          this.commentForm = this.formBuilder.group({
            comment: [
              col.userData?.publicComment || '',
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(250),
              ],
            ],
          });
        })
      )
      .subscribe((col) => {
        this.collection = col;
        this.totalWishing = col.userData?.wishing || 0;
        this.totalTrading = col.userData?.trading || 0;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);

    this.actualPage = this.router.url.split('/').pop() || '';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((data: any) => {
        this.actualPage = data.url.split('/').pop() || '';
      });

    if (this.authUser.accountTypeId == 1) {
      this.loadAds();
    }
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  get form() {
    return this.commentForm.controls;
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      return;
    }

    this.isSaving = true;

    this.colSrv
      .addComment(this.collection.id, this.commentForm.value.comment)
      .pipe(take(1))
      .subscribe((resp: string) => {
        this.uiSrv.showSuccess('Comentario actualizado exitosamente');
        this.isSaving = false;

        let tempUserData = {
          ...this.collection.userData,
          publicComment: this.commentForm.value.comment,
        } as CollectionUserData;

        this.colOnlySrv.setCurrentCollection({
          ...this.collection,
          userData: tempUserData,
        });
      });
  }

  onDeleteComment() {
    this.isSaving = true;

    this.colSrv
      .removeComment(this.collection.id)
      .pipe(take(1))
      .subscribe((resp: string) => {
        this.uiSrv.showSuccess('Comentario eliminado exitosamente');

        let tempUserData = {
          ...this.collection.userData,
          publicComment: undefined,
        } as CollectionUserData;

        this.colOnlySrv.setCurrentCollection({
          ...this.collection,
          userData: tempUserData,
        });

        this.isSaving = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
