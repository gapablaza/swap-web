import { Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { OfflineService, UserService } from 'src/app/core';
import { offlineActions } from './offline.actions';
import { authFeature } from '../../auth/store/auth.state';
import { offlineFeature } from './offline.state';
import { authActions } from '../../auth/store/auth.actions';

@Injectable()
export class OfflineEffects {
  saveCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(offlineActions.saveOfflineUserCollection),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      exhaustMap(([{ collection }, authUser]) =>
        this.offlineSrv
          .saveCollection({
            userId: authUser.id,
            collectionId: collection.id,
            data: collection,
            lastUpdated: collection.updated || '',
          })
          .then(() => {
            return offlineActions.saveOfflineUserCollectionSuccess();
          })
          .catch((error) => offlineActions.saveOfflineUserCollectionFailure())
      )
    )
  );

  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        offlineActions.loadOfflineUserCollections,
        offlineActions.saveOfflineUserCollectionSuccess,
        offlineActions.syncUserCollectionsSuccess
      ),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      exhaustMap(([, authUser]) =>
        this.offlineSrv
          .getAllCollections(authUser.id)
          .then((collections) => {
            const cols = collections.map((col) => col.data);
            return offlineActions.loadOfflineUserCollectionsSuccess({
              collections: cols,
            });
          })
          .catch((error) => offlineActions.loadOfflineUserCollectionsFailure())
      )
    )
  );

  // offline page opened
  offlinePageOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(offlineActions.offlinePageOpened),
      map(() => {
        this.store.dispatch(offlineActions.loadOnlineUserCollections());
        return offlineActions.loadOfflineUserCollections();
      })
    )
  );

  // load online user collections
  loadOnlineUserCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(offlineActions.loadOnlineUserCollections),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      exhaustMap(([, authUser]) => {
        return this.userSrv.getCollections(authUser.id).pipe(
          map((resp) =>
            offlineActions.loadOnlineUserCollectionsSuccess({
              collections: resp.collections,
            })
          ),
          catchError((error) =>
            of(offlineActions.loadOnlineUserCollectionsFailure())
          )
        );
      })
    )
  );

  // sync user collections
  syncUserCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(offlineActions.syncUserCollections),
      withLatestFrom(
        this.store.select(authFeature.selectUser),
        this.store.select(offlineFeature.selectNeedSyncCollections),
        this.store.select(offlineFeature.selectNeedDeleteCollections)
      ),
      exhaustMap(([, authUser, needSync, needDelete]) => {
        // 1.- delete collections
        let deleteObservable: Observable<void | null> = of(null); // Default observable en caso de que no haya eliminación
        if (needDelete.length > 0) {
          const deleteCollectionIDs = needDelete
            .slice(0, 100) // limit to 100 collections
            .map((col) => col.id);

          deleteObservable = from(
            this.offlineSrv.deleteMultipleCollection(
              authUser.id,
              deleteCollectionIDs
            )
          ).pipe(
            catchError((error) => {
              console.error(`Error eliminando colecciones:`, error);
              return of(null); // Continúa la ejecución incluso si hay un error
            })
          );
        }

        // 2.- sync collections
        let syncObservable: Observable<void | null> = of(null); // Default observable en caso de que no haya sincronización
        if (needSync.length > 0) {
          const syncCollectionIDs = needSync
            .slice(0, 100) // limit to 100 collections
            .map((col) => col.id)
            .join(',');

          syncObservable = this.userSrv
            .getMultipleCollectionsInfo(authUser.id, syncCollectionIDs)
            .pipe(
              switchMap((collections) =>
                from(
                  this.offlineSrv.saveMultipleCollections(
                    collections.map((col) => ({
                      userId: authUser.id,
                      collectionId: col.id,
                      data: col,
                      lastUpdated: col.updated || '',
                    }))
                  )
                ).pipe(
                  catchError((error) => {
                    console.error('Error sincronizando colecciones:', error);
                    return of(null); // Continúa la ejecución incluso si hay un error
                  })
                )
              )
            );
        }

        // 3.- Combine delete and sync
        return from(deleteObservable).pipe(
          mergeMap(() => syncObservable),
          map(() => offlineActions.syncUserCollectionsSuccess()),
          catchError((error) => {
            console.error(
              'Error al finalizar la sincronización de colecciones',
              error
            );
            return of(offlineActions.syncUserCollectionsFailure());
          })
        );
      })
    )
  );

  // Sync user collections every 30 minutes, starting after 10 minutes
  syncUserCollectionsPeriodically$ = createEffect(() =>
    this.actions$.pipe(
      // Se inicia después del inicio de sesión exitoso
      ofType(
        authActions.authSuccess,
        authActions.localAuthSuccess,
        offlineActions.syncUserCollectionsPeriodically,
        offlineActions.offlinePageClosed
      ),
      withLatestFrom(
        this.store.select(authFeature.selectIsAuth),
        this.store.select(authFeature.selectIsConnected)
      ),
      filter(([, isAuth, isConnected]) => isAuth && isConnected),
      switchMap(() => {
        // Inicialmente espera 10 minutos, luego ejecuta cada 60 minutos
        const syncTimer$ = timer(10 * 60 * 1000, 60 * 60 * 1000).pipe(
          // Paso 1: Disparar las acciones para cargar colecciones usando dispatch
          tap(() => {
            this.store.dispatch(offlineActions.loadOnlineUserCollections());
            this.store.dispatch(offlineActions.loadOfflineUserCollections());
          }),

          // Paso 2: Esperar a que ambas colecciones se hayan cargado
          switchMap(() =>
            combineLatest([
              this.store.select(offlineFeature.selectIsOnlineCollectionsLoaded), // Selector que indica si las colecciones online se han cargado
              this.store.select(
                offlineFeature.selectIsOfflineCollectionsLoaded
              ), // Selector que indica si las colecciones offline se han cargado
            ]).pipe(
              filter(
                ([isOnlineLoaded, isOfflineLoaded]) =>
                  isOnlineLoaded && isOfflineLoaded
              ), // Solo continuar si ambas están cargadas
              take(1) // Para asegurarnos de que avanzamos solo una vez que ambas están cargadas
            )
          ),

          // Paso 3: Realizar la sincronización una vez que las colecciones han sido cargadas
          switchMap(() => of(offlineActions.syncUserCollections())),
          catchError((error) => {
            console.error(
              'Error al sincronizar periódicamente las colecciones',
              error
            );
            return of(offlineActions.syncUserCollectionsFailure());
          })
        );

        // Observa eventos para detener o reiniciar el proceso
        return syncTimer$.pipe(
          takeUntil(
            merge(
              this.actions$.pipe(ofType(authActions.logoutFinish)),
              this.actions$.pipe(ofType(offlineActions.offlinePageOpened))
            )
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private offlineSrv: OfflineService,
    private userSrv: UserService
  ) {}
}
