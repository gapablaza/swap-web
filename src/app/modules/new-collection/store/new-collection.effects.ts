import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Router } from '@angular/router';

import { ItemService, NewCollectionService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { newCollectionActions } from './new-collection.actions';
import { newCollectionFeature } from './new-collection.state';
import { authFeature } from '../../auth/store/auth.state';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class NewCollectionEffects {
  // load route params
  public setParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.loadParams),
      map((action) => action.params),
      map((params) => {
        return newCollectionActions.loadParamsSuccess({ params });
      }),
      catchError((error) =>
        of(
          newCollectionActions.loadParamsFailure({
            error: 'Error al cargar los parámetros',
          })
        )
      )
    )
  );

  // load new collections
  public loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        newCollectionActions.loadData,
        newCollectionActions.loadParamsSuccess
      ),
      withLatestFrom(this.store.select(newCollectionFeature.selectRouteParams)),
      exhaustMap(([, params]) =>
        this.newColSrv.list(params).pipe(
          map(({ newCollections, paginator }) =>
            newCollectionActions.loadDataSuccess({
              newCollections,
              paginator,
            })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadDataFailure({
                error: 'No se pudo cargar las nuevas colecciones',
              })
            )
          )
        )
      )
    )
  );

  // load add or edit
  public loadAddOrEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.loadAddOrEdit),
      map((action) => action.collectionId),
      exhaustMap((collectionId) => {
        // const collectionId = this.route.snapshot.params['id'];
        if (collectionId) {
          return this.newColSrv.get(parseInt(collectionId)).pipe(
            map(({ newCollection }) =>
              newCollectionActions.loadAddOrEditSuccess({ newCollection })
            ),
            catchError((error) =>
              of(
                newCollectionActions.loadAddOrEditFailure({
                  error: 'No se pudo cargar la colección',
                })
              )
            )
          );
        } else {
          return of(
            newCollectionActions.loadAddOrEditSuccess({ newCollection: null })
          );
        }
      })
    )
  );

  // load new collection
  public loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.loadCollection),
      exhaustMap((action) => {
        return this.newColSrv.get(action.collectionId).pipe(
          map(({ newCollection, checklists, votes }) =>
            newCollectionActions.loadCollectionSuccess({
              newCollection,
              checklists,
              votes,
            })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadCollectionFailure({
                error: 'No se pudo cargar la colección',
              })
            )
          )
        );
      })
    )
  );

  // load history
  public loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.loadHistory),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([, newCollection]) =>
        this.newColSrv.getHistory(newCollection!.id).pipe(
          map((history) =>
            newCollectionActions.loadHistorySuccess({ history })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadHistoryFailure({
                error: 'No se pudo cargar el historial',
              })
            )
          )
        )
      )
    )
  );

  // load comments
  public loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.loadComments),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([, newCollection]) =>
        this.newColSrv.getComments(newCollection!.id).pipe(
          map((comments) =>
            newCollectionActions.loadCommentsSuccess({ comments })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadCommentsFailure({
                error: 'No se pudo cargar los comentarios',
              })
            )
          )
        )
      )
    )
  );

  // add comment
  public addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.addComment),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection),
        this.store.select(authFeature.selectUser)
      ),
      exhaustMap(([action, newCollection, authUser]) =>
        this.newColSrv.addComment(newCollection!.id, action.commentMsg).pipe(
          map(({ message, newId }) => {
            const actualDate = Math.floor(Date.now() / 1000);
            const comment = {
              comment: action.commentMsg,
              created: actualDate,
              id: newId,
              updated: actualDate,
              user: {
                data: authUser,
              },
            };
            return newCollectionActions.addCommentSuccess({ message, comment });
          }),
          catchError((error) =>
            of(
              newCollectionActions.addCommentFailure({
                error: 'No se pudo agregar el comentario',
              })
            )
          )
        )
      )
    )
  );

  // load item types
  public loadItemTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        newCollectionActions.loadItemTypes,
        newCollectionActions.loadCollectionSuccess
      ),
      withLatestFrom(this.store.select(newCollectionFeature.selectItemTypes)),
      filter(([, itemTypes]) => itemTypes.length == 0),
      exhaustMap(() =>
        this.itemSrv.getTypes().pipe(
          map((itemTypes) =>
            newCollectionActions.loadItemTypesSuccess({ itemTypes })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadItemTypesFailure({
                error: 'No se pudo cargar los tipos de ítems',
              })
            )
          )
        )
      )
    )
  );

  // load publishers
  public loadPublishers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        newCollectionActions.loadPublishers,
        newCollectionActions.loadAddOrEditSuccess
      ),
      withLatestFrom(this.store.select(newCollectionFeature.selectPublishers)),
      filter(([, publishers]) => publishers.length == 0),
      exhaustMap(() =>
        this.newColSrv.getPublishers().pipe(
          map((publishers) =>
            newCollectionActions.loadPublishersSuccess({ publishers })
          ),
          catchError((error) =>
            of(
              newCollectionActions.loadPublishersFailure({
                error: 'No se pudo cargar las editoriales',
              })
            )
          )
        )
      )
    )
  );

  // vote collection
  onVote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.vote),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection),
        this.store.select(authFeature.selectUser)
      ),
      exhaustMap(([action, newCollection, authUser]) =>
        this.newColSrv.setVote(newCollection!.id, action.vote).pipe(
          map((message) =>
            newCollectionActions.voteSuccess({
              message,
              vote: action.vote,
              user: authUser,
            })
          ),
          catchError((error) =>
            of(
              newCollectionActions.voteFailure({
                error: 'No se pudo actualizar tu voto',
              })
            )
          )
        )
      )
    )
  );

  // add checklist
  onAddChecklist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.addChecklist),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([action, newCollection]) =>
        this.newColSrv
          .addChecklist(newCollection!.id, action.checklistItems)
          .pipe(
            map(({ message }) => {
              this.router.navigate(['new-collection/', newCollection!.id]);
              return newCollectionActions.addChecklistSuccess({ message });
            }),
            catchError((error) =>
              of(
                newCollectionActions.addChecklistFailure({
                  error: 'No se pudo agregar el checklist',
                })
              )
            )
          )
      )
    )
  );

  // set checklist
  onSetChecklist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.setChecklist),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([action, newCollection]) =>
        this.newColSrv
          .setChecklist({
            newCollectionId: newCollection!.id,
            checklistId: action.checklistId,
          })
          .pipe(
            map((message) =>
              newCollectionActions.setChecklistSuccess({
                message,
                checklistId: action.checklistId,
              })
            ),
            catchError((error) =>
              of(
                newCollectionActions.setChecklistFailure({
                  error: 'No se pudo seleccionar el checklist',
                })
              )
            )
          )
      )
    )
  );

  // add new collection
  addNewCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.addNewCollection),
      map((action) => action.newCollectionForm),
      exhaustMap((newCollectionForm) =>
        this.newColSrv.add(newCollectionForm).pipe(
          map(({ message, newId }) => {
            this.router.navigate(['new-collection/', newId]);
            return newCollectionActions.addNewCollectionSuccess({ message });
          }),
          catchError((error) =>
            of(
              newCollectionActions.addNewCollectionFailure({
                error: 'No se pudo agregar la colección',
              })
            )
          )
        )
      )
    )
  );

  // update new collection
  updateNewCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.updateNewCollection),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([action, newCollection]) =>
        this.newColSrv
          .update({
            ...action.newCollectionForm,
            id: newCollection!.id,
          })
          .pipe(
            map((message) => {
              this.router.navigate(['new-collection/', newCollection!.id]);
              return newCollectionActions.updateNewCollectionSuccess({
                message,
              });
            }),
            catchError((error) =>
              of(
                newCollectionActions.updateNewCollectionFailure({
                  error: 'No se pudo actualizar la colección',
                })
              )
            )
          )
      )
    )
  );

  // sanction new collection
  onSanction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newCollectionActions.sanctionNewCollection),
      withLatestFrom(
        this.store.select(newCollectionFeature.selectNewCollection)
      ),
      exhaustMap(([action, newCollection]) =>
        this.newColSrv
          .sanction({
            newCollectionId: newCollection!.id,
            newStatus: action.newStatus,
            comment: action.comment,
          })
          .pipe(
            map((message) => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['new-collection/', newCollection?.id]);
                });
              this.dialog.closeAll();
              return newCollectionActions.sanctionNewCollectionSuccess({
                message,
              });
            }),
            catchError((error) =>
              of(
                newCollectionActions.sanctionNewCollectionFailure({
                  error: 'No se pudo suspender la colección',
                })
              )
            )
          )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          newCollectionActions.voteSuccess,
          newCollectionActions.addChecklistSuccess,
          newCollectionActions.setChecklistSuccess,
          newCollectionActions.addCommentSuccess,
          newCollectionActions.updateNewCollectionSuccess,
          newCollectionActions.sanctionNewCollectionSuccess,
        ),
        map((action) => action.message),
        tap((message) => {
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          newCollectionActions.loadParamsFailure,
          newCollectionActions.loadDataFailure,
          newCollectionActions.loadCollectionFailure,
          newCollectionActions.loadHistoryFailure,
          newCollectionActions.loadItemTypesFailure,
          newCollectionActions.voteFailure,
          newCollectionActions.addChecklistFailure,
          newCollectionActions.setChecklistFailure,
          newCollectionActions.addCommentFailure,
          newCollectionActions.updateNewCollectionFailure,
          newCollectionActions.sanctionNewCollectionFailure,
        ),
        map((action) => action.error),
        tap((error) => {
          this.uiSrv.showError(error);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private dialog: MatDialog,
    private newColSrv: NewCollectionService,
    private itemSrv: ItemService,
    private uiSrv: UIService,
    private router: Router
  ) {}
}
