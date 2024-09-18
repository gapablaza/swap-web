import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Collection } from 'src/app/core';
import { offlineActions } from './offline.actions';

interface State {
  onlineCollections: Collection[];
  offlineCollections: Collection[];

  isOnlineCollectionsLoaded: boolean;
  isOfflineCollectionsLoaded: boolean;

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  onlineCollections: [],
  offlineCollections: [],

  isOnlineCollectionsLoaded: false,
  isOfflineCollectionsLoaded: false,

  isProcessing: false,
  error: null,
};

export const offlineFeature = createFeature({
  name: 'offline',
  reducer: createReducer(
    initialState,

    // load online collections
    on(offlineActions.loadOnlineUserCollections, (state) => ({
      ...state,
      onlineCollections: [],
      isOnlineCollectionsLoaded: false,
      isProcessing: true,
    })),
    on(
      offlineActions.loadOnlineUserCollectionsSuccess,
      (state, { collections }) => ({
        ...state,
        onlineCollections: collections,
        isOnlineCollectionsLoaded: true,
        isProcessing: false,
      })
    ),
    on(offlineActions.loadOnlineUserCollectionsFailure, (state) => ({
      ...state,
      isOnlineCollectionsLoaded: false,
      isProcessing: false,
    })),

    // load offline collections
    on(offlineActions.loadOfflineUserCollections, (state) => ({
      ...state,
      offlineCollections: [],
      isOfflineCollectionsLoaded: false,
      isProcessing: true,
    })),
    on(
      offlineActions.loadOfflineUserCollectionsSuccess,
      (state, { collections }) => ({
        ...state,
        offlineCollections: collections,
        isOfflineCollectionsLoaded: true,
        isProcessing: false,
      })
    ),
    on(offlineActions.loadOfflineUserCollectionsFailure, (state) => ({
      ...state,
      isOfflineCollectionsLoaded: false,
      isProcessing: false,
    })),

    // offline sync
    on(offlineActions.syncUserCollections, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(offlineActions.syncUserCollectionsSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(offlineActions.syncUserCollectionsFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // on page closed
    on(offlineActions.offlinePageClosed, (state) => ({
      ...state,
      onlineCollections: [],
      offlineCollections: [],
      isUserCollectionsLoaded: false,
      isProcessing: false,
    }))
  ),
  extraSelectors: ({ selectOnlineCollections, selectOfflineCollections }) => ({
    selectNeedSyncCollections: createSelector(
      selectOnlineCollections,
      selectOfflineCollections,
      (online, offline) => {
        // Crear un Map de las colecciones offline para acceso rápido
        const offlineMap = new Map(offline.map((c) => [c.id, c]));

        // Filtrar las colecciones online para determinar cuáles necesitan sincronización
        return online.filter((onlineCollection) => {
          const offlineCollection = offlineMap.get(onlineCollection.id);

          // Si la colección no existe en offline o tiene una fecha de actualización distinta, necesita sincronizarse
          return (
            !offlineCollection ||
            onlineCollection.userSummary?.updated !== offlineCollection.updated
          );
        });
      }
    ),
    selectNeedDeleteCollections: createSelector(
      selectOnlineCollections,
      selectOfflineCollections,
      (online, offline) => {
        // si no hay datos online
        if (!online.length) return [];

        // Crear un Map de las colecciones online para acceso rápido
        const onlineMap = new Map(online.map((c) => [c.id, c]));

        return offline.filter((offlineCollection) => {
          const onlineCollection = onlineMap.get(offlineCollection.id);

          // si la colección no existe en online
          return !onlineCollection;
        });
      }
    ),
  }),
});
