import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, take, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { NewCollectionChecklistComponent } from '../new-collection-checklist/new-collection-checklist.component';
import { NewCollectionHistoryComponent } from '../new-collection-history/new-collection-history.component';
import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  ItemService,
  ItemType,
  NewChecklist,
  NewCollection,
  NewCollectionComment,
  NewCollectionService,
  SEOService,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-collection-profile',
  templateUrl: './new-collection-profile.component.html',
  styleUrls: ['./new-collection-profile.component.scss'],
})
export class NewCollectionProfileComponent implements OnInit, OnDestroy {
  @ViewChild('sendDialog') sendDialog!: TemplateRef<any>;
  @ViewChild('sanctionOptionsDialog') sanctionOptionsDialog!: TemplateRef<any>;

  authUser: User = {} as User;
  newCollection: NewCollection = {} as NewCollection;
  comments: NewCollectionComment[] = [];
  checklists: NewChecklist[] = [];
  types: ItemType[] = [];
  votes: User[] = [];

  statusClasses = ['default', 'warning', 'warning', 'warn', 'info', 'success'];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  sendForm!: FormGroup;
  sanctionForm!: FormGroup;
  commentForm!: FormGroup;

  canBack;
  canUpdate = false;
  canSend = false;
  canSanction = false;
  canAddChecklist = false;
  canSetChecklist = false;
  canVote = false;
  canComment = false;

  hasVoted = false;
  isSaving = false;
  isLoaded = false;
  isCommentsLoaded = false;

  subs: Subscription = new Subscription();

  constructor(
    private newColSrv: NewCollectionService,
    private itemSrv: ItemService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private SEOSrv: SEOService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.canBack = this.router.getCurrentNavigation() == null ? false : true;
  }

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();

    let newColSub = this.newColSrv
      .get(Number(this.activatedRoute.snapshot.params['id']))
      .pipe(
        tap((resp) => {
          this.hasVoted =
            resp.votes.findIndex((vote) => vote.id == this.authUser.id) >= 0
              ? true
              : false;

          this.SEOSrv.set({
            title: `Nueva solicitud para agregar: ${resp.newCollection.name} - ${resp.newCollection.publisher.data.name} (${resp.newCollection.year}) - Intercambia Láminas`,
            description: `Ayúdanos para agregar esta solicitud del álbum/colección: ${resp.newCollection.name} de ${resp.newCollection.publisher.data.name} (${resp.newCollection.year}) y así puedes encontrar con quien poder cambiar sus ítems (láminas / stickers / figuritas / pegatinas / cromos / estampas / barajitas).`,
            url: `${environment.appUrl}/new-collection/${resp.newCollection.id}`,
            isCanonical: true,
          });
        })
      )
      .subscribe((resp) => {
        this.newCollection = resp.newCollection;
        this.checklists = resp.checklists;
        this.votes = resp.votes.sort((a, b) => {
          return (a.displayName || '').toLocaleLowerCase() >
            (b.displayName || '').toLocaleLowerCase()
            ? 1
            : -1;
        });

        if (!this.authUser.disabled) {
          // Define si el usuario puede modificar la solicitud
          this.canUpdate =
            ([1, 2].includes(this.newCollection.statusId) &&
              this.authUser.isMod) ||
            (this.newCollection.statusId == 2 &&
              this.authUser.id == this.newCollection.user.data?.id) ||
            ([1, 2, 3, 4].includes(this.newCollection.statusId) &&
              this.authUser.id == 1);

          // Define si el usuario puede enviar a revisión la solicitud
          this.canSend =
            this.newCollection.statusId == 2 &&
            this.authUser.id == this.newCollection.user.data?.id;

          // Define si el usuario puede sancionar la solicitud
          this.canSanction =
            (this.newCollection.statusId == 1 && this.authUser.isMod) ||
            ([1, 2, 3, 4].includes(this.newCollection.statusId) &&
              this.authUser.id == 1);

          // Define si puede seleccionar un itemizado
          this.canSetChecklist =
            ([1, 2].includes(this.newCollection.statusId) &&
              this.authUser.isMod) ||
            ([1, 2, 3, 4].includes(this.newCollection.statusId) &&
              this.authUser.id == 1);

          // Define si puede votar
          this.canVote = this.newCollection.statusId == 5 ? false : true;

          // Define si puede agregar un itemizado
          this.canAddChecklist =
            [1, 2].includes(this.newCollection.statusId) ||
            ([1, 2, 3, 4].includes(this.newCollection.statusId) &&
              this.authUser.id == 1);

          // Define si puede comentar
          this.canComment =
            this.authUser.daysSinceRegistration >= 30 &&
            [1, 2, 3, 4].includes(this.newCollection.statusId);
        }

        this.isLoaded = true;
        this.loadComments();
      });
    this.subs.add(newColSub);

    let typesSub = this.itemSrv
      .getTypes()
      .pipe(take(1))
      .subscribe((resp) => (this.types = resp));
    this.subs.add(typesSub);

    this.sanctionForm = this.formBuilder.group({
      sanctionComment: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(250),
        ],
      ],
    });

    this.sendForm = this.formBuilder.group({
      sendComment: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(250),
        ],
      ],
    });

    this.commentForm = this.formBuilder.group({
      newComment: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  onVote(action: boolean) {
    this.isSaving = true;
    this.newColSrv
      .setVote(this.newCollection.id, action)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          // TODO: Agregar o quitar del listado de usuarios que han votado
          if (action) {
            this.votes.push(this.authUser);
          } else {
            this.votes = [
              ...this.votes.filter((vote) => vote.id !== this.authUser.id),
            ];
          }
          this.hasVoted = action;
          this.uiSrv.showSuccess(resp);
          this.isSaving = false;
        },
        error: (error) => {
          console.log('onVote error: ', error);
          this.isSaving = false;
        },
      });
  }

  onOpenChecklist(checklistId: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['checklist-modal'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      newCollection: this.newCollection,
      checklist: this.checklists.find((e) => e.id == checklistId),
      types: this.types,
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
      newCollection: this.newCollection,
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

    this.isSaving = true;
    this.newColSrv
      .sanction({
        newCollectionId: this.newCollection.id,
        newStatus: sanctionId,
        comment: newComment,
      })
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.uiSrv.showSuccess(resp);
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['new-collection/', this.newCollection.id]);
            });
          this.dialog.closeAll();
        },
        error: (error) => {
          console.log('sanction error: ', error);
          this.isSaving = false;
        },
      });
  }

  onSetChecklist(checklistId: number) {
    this.isSaving = true;

    this.newColSrv
      .setChecklist({
        newCollectionId: this.newCollection.id,
        checklistId: checklistId,
      })
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.uiSrv.showSuccess(resp);
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['new-collection/', this.newCollection.id]);
            });
        },
        error: (error) => {
          console.log('setChecklist error: ', error);
          this.isSaving = false;
        },
      });
  }

  loadComments(): void {
    this.isCommentsLoaded = false;

    this.newColSrv
      .getComments(this.newCollection.id)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.comments = resp.sort((a, b) => {
            return a.created > b.created ? 1 : -1;
          });
          this.isCommentsLoaded = true;
        },
        error: (error) => {
          console.log('loadComments error: ', error);
        },
      });
  }

  trackByComments(index: number, item: NewCollectionComment): number {
    return item.id;
  }

  onComment(): void {
    if (this.commentForm.invalid) return;

    this.isSaving = true;
    let newCom = this.commentForm.get('newComment')?.value || '';

    this.newColSrv
      .addComment(this.newCollection.id, newCom)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.uiSrv.showSuccess(resp.message);
          this.canComment = false;
          this.isSaving = false;
          this.loadComments();
        },
        error: (error) => {
          console.log('onComment error: ', error);
          this.isSaving = false;
        },
      });
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
