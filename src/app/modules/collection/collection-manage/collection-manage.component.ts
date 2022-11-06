import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, take, tap } from 'rxjs';

import { Collection, CollectionService, CollectionUserData } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-manage',
  templateUrl: './collection-manage.component.html',
  styleUrls: ['./collection-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionManageComponent implements OnInit, OnDestroy {
  commentForm!: FormGroup;
  collection: Collection = {} as Collection;
  totalWishing: number = 0;
  totalTrading: number = 0;
  actualPage = '';
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colOnlySrv: CollectionOnlyService,
    private colSrv: CollectionService,
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
        console.log('CollectionManageComponent - Sub colOnlySrv');
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
          publicComment: this.commentForm.value.comment
        } as CollectionUserData;

        this.colOnlySrv.setCurrentCollection({
          ...this.collection,
          userData: tempUserData
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
          publicComment: undefined
        } as CollectionUserData;

        this.colOnlySrv.setCurrentCollection({
          ...this.collection,
          userData: tempUserData
        });

        this.isSaving = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
