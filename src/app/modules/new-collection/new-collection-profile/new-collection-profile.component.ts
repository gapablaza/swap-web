import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Store } from '@ngrx/store';

import { LinebreaksPipe } from '../../../shared/pipes/linebreaks.pipe';
import { NewCollectionChecklistComponent } from '../new-collection-checklist/new-collection-checklist.component';
import { NewCollectionHistoryComponent } from '../new-collection-history/new-collection-history.component';
import {
  DEFAULT_USER_PROFILE_IMG,
  NewCollection,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { newCollectionActions } from '../store/new-collection.actions';
import { newCollectionFeature } from '../store/new-collection.state';
import { authFeature } from '../../auth/store/auth.state';
import { NewCollectionCommentsComponent } from '../new-collection-comments/new-collection-comments.component';

@Component({
  selector: 'app-new-collection-profile',
  templateUrl: './new-collection-profile.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    LazyLoadImageModule,

    LinebreaksPipe,
    NewCollectionCommentsComponent,
  ],
})
export class NewCollectionProfileComponent implements OnInit, OnDestroy {
  authUser$ = this.store.selectSignal(authFeature.selectUser);
  newCollection$ = this.store.selectSignal(
    newCollectionFeature.selectNewCollection
  );
  checklists$ = this.store.selectSignal(
    newCollectionFeature.selectNewCollectionChecklists
  );
  votes$ = this.store.selectSignal(
    newCollectionFeature.selectNewCollectionVotesOrdered
  );

  canVote$ = this.store.select(newCollectionFeature.selectCanVote);
  hasVoted$ = this.store.select(newCollectionFeature.selectHasVoted);

  canSend$ = this.store.select(newCollectionFeature.selectCanSend);
  canSanction$ = this.store.select(newCollectionFeature.selectCanSanction);
  canUpdate$ = this.store.select(newCollectionFeature.selectCanUpdate);

  canAddChecklist$ = this.store.select(
    newCollectionFeature.selectCanAddChecklist
  );
  canSetChecklist$ = this.store.select(
    newCollectionFeature.selectCanSetChecklist
  );

  isLoaded$ = this.store.select(
    newCollectionFeature.selectIsNewCollectionLoaded
  );
  isProcessing$ = this.store.select(newCollectionFeature.selectIsProcessing);

  types = this.store.selectSignal(newCollectionFeature.selectItemTypes);

  @ViewChild('sendDialog') sendDialog!: TemplateRef<any>;
  @ViewChild('sanctionOptionsDialog') sanctionOptionsDialog!: TemplateRef<any>;

  authUser: User = {} as User;
  newCollection: NewCollection = {} as NewCollection;

  statusClasses = ['default', 'warning', 'warning', 'warn', 'info', 'success'];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  sendForm = this.formBuilder.group({
    sendComment: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(250)],
    ],
  });

  sanctionForm = this.formBuilder.group({
    sanctionComment: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(250)],
    ],
  });

  canBack;
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private uiSrv: UIService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.canBack = this.router.getCurrentNavigation() == null ? false : true;
  }

  ngOnInit(): void {
    this.store.dispatch(
      newCollectionActions.loadCollection({
        collectionId: Number(this.activatedRoute.snapshot.params['id']),
      })
    );
  }

  onVote(vote: boolean) {
    this.store.dispatch(newCollectionActions.vote({ vote }));
  }

  onOpenChecklist(checklistId: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['checklist-modal'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      newCollection: this.newCollection$(),
      checklist: this.checklists$().find((e) => e.id == checklistId),
      types: this.types(),
    };

    this.dialog.open(NewCollectionChecklistComponent, dialogConfig);
  }

  onOpenHistory() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['history-modal'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      newCollection: this.newCollection$(),
    };

    this.dialog.open(NewCollectionHistoryComponent, dialogConfig);
  }

  onSend() {
    this.dialog.open(this.sendDialog, { disableClose: true });
  }

  onSanctionOptions() {
    this.dialog.open(this.sanctionOptionsDialog, { disableClose: true });
  }

  onSanction(sanction: string) {
    let sanctionId = 0;
    if (sanction == 'send') {
      sanctionId = 1;
    } else if (sanction == 'info') {
      sanctionId = 2;
    } else if (sanction == 'reject') {
      sanctionId = 3;
    } else if (sanction == 'ok') {
      sanctionId = 4;
    }
    if (sanctionId == 0) return;

    let newComment = '';
    // si es el formulario de enviar a revisión
    if (sanctionId == 1) {
      if (this.sendForm.invalid) return;
      newComment = this.sendForm.get('sendComment')?.value || '';
    }
    // si es el formulario para sancionar
    else {
      if (this.sanctionForm.invalid) return;
      newComment = this.sanctionForm.get('sanctionComment')?.value || '';
    }

    this.store.dispatch(
      newCollectionActions.sanctionNewCollection({
        newStatus: sanctionId,
        comment: newComment,
      })
    );
  }

  onSetChecklist(checklistId: number) {
    this.store.dispatch(newCollectionActions.setChecklist({ checklistId }));
  }

  onBack(): void {
    if (this.canBack) {
      this.location.back();
    } else {
      this.router.navigate(['new-collection']);
    }
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
