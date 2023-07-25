import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { NewCollectionChecklistComponent } from '../new-collection-checklist/new-collection-checklist.component';
import {
  AuthService,
  NewCollection,
  NewCollectionService,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-new-collection-profile',
  templateUrl: './new-collection-profile.component.html',
  styleUrls: ['./new-collection-profile.component.scss'],
})
export class NewCollectionProfileComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  newCollection: NewCollection = {} as NewCollection;

  // comments: Comment[] = [];
  // checklists: Checklist[] = [];
  votes: User[] = [];
  hasVoted = false;

  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private newColSrv: NewCollectionService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();

    this.newColSrv
      .get(Number(this.activatedRoute.snapshot.params['id']))
      .pipe(
        tap((resp) => {
          this.hasVoted =
            resp.votes.findIndex((vote) => vote.id == this.authUser.id) >= 0
              ? true
              : false;
        })
      )
      .subscribe((resp) => {
        console.log(resp);
        this.newCollection = resp.newCollection;
        this.votes = resp.votes.sort((a, b) => {
          return (a.displayName || '').toLocaleLowerCase() >
            (b.displayName || '').toLocaleLowerCase()
            ? 1
            : -1;
        });
        this.isLoaded = true;
      });
  }

  onVote(action: boolean) {
    this.isSaving = true;
    this.newColSrv
      .setVote(Number(this.activatedRoute.snapshot.params['id']), action)
      .pipe(take(1))
      .subscribe((resp) => {
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
      });
  }

  onOpenChecklist() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['checklist-modal'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';

    this.dialog.open(NewCollectionChecklistComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
