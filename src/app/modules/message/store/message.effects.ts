import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { MessageService } from 'src/app/core';
import { messagesActions } from './message.actions';
import { authFeature } from '../../auth/store/auth.state';
import { UIService } from 'src/app/shared';

@Injectable()
export class MessageEffects {
  // Carga el resumen de conversaciones del usuario autenticado
  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.loadConversations),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([action, user]) =>
        this.messageSrv.resume(user.id).pipe(
          takeUntil(
            this.actions$.pipe(ofType(messagesActions.loadConversationsDestroy))
          ),
          map((messages) =>
            messagesActions.loadConversationsSuccess({ messages })
          ),
          catchError((error) =>
            of(messagesActions.loadConversationsFailure({ error }))
          )
        )
      )
    )
  );

  // Carga los mensajes del usuario autenticado con otro usuario
  loadOneConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.loadOneConversation),
      map((action) => action.otherUserId),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([otherUserId, user]) =>
        this.messageSrv.conversation(user.id, otherUserId).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(messagesActions.loadOneConversationDestroy)
            )
          ),
          map((conversation) =>
            messagesActions.loadOneConversationSuccess({
              otherUserId,
              conversation,
            })
          ),
          catchError((error) =>
            of(messagesActions.loadOneConversationFailure({ error }))
          )
        )
      )
    )
  );

  // Marca como leída la conversación entre el usuario autenticado y otro usuario
  cleanUnreads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.loadOneConversationSuccess),
      map((action) => action.otherUserId),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([otherUserId, user]) =>
        this.messageSrv.cleanUnread(user.id, otherUserId).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(messagesActions.loadOneConversationDestroy)
            )
          ),
          map(() => messagesActions.cleanUnreadsSuccess()),
          catchError((error) =>
            of(messagesActions.cleanUnreadsFailure({ error }))
          )
        )
      )
    )
  );

  // Detecta si una conversación está archivada
  conversationIsArchived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.loadOneConversationSuccess),
      map((action) => action.otherUserId),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([otherUserId, user]) =>
        this.messageSrv.conversationArchived(user.id, otherUserId).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(messagesActions.loadOneConversationDestroy)
            )
          ),
          map((isArchived) =>
            messagesActions.conversationIsArchivedSuccess({ isArchived })
          ),
          catchError((error) =>
            of(messagesActions.conversationIsArchivedFailure({ error }))
          )
        )
      )
    )
  );

  // Marca como archivada una conversación específica
  archiveConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.archiveConversation),
      map((action) => action.otherUserId),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([otherUserId, user]) =>
        this.messageSrv.archive(user.id, otherUserId).pipe(
          map(() => messagesActions.archiveConversationSuccess()),
          catchError((error) =>
            of(messagesActions.archiveConversationFailure({ error }))
          )
        )
      )
    )
  );

  // Notifica y redirige luego de archivar una conversación
  archiveConversationSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(messagesActions.archiveConversationSuccess),
        tap(() => {
          this.uiSrv.showSuccess('Conversación archivada exitosamente');
          this.router.navigate(['message']);
        })
      );
    },
    { dispatch: false }
  );

  // Envía un nuevo mensaje para una conversación
  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(messagesActions.sendMessage),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      filter(([action, user]) => user.disabled !== true),
      filter(([action, user]) => action.otherUser.disabled !== true),
      switchMap(([action, user]) =>
        this.messageSrv.send(user, action.otherUser, action.message).pipe(
          map(() => messagesActions.sendMessageSuccess()),
          catchError((error) =>
            of(messagesActions.sendMessageFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private messageSrv: MessageService,
    private uiSrv: UIService,
    private router: Router
  ) {}
}
