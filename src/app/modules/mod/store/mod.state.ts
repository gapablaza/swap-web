import { createFeature, createReducer, on } from '@ngrx/store';

import { Media, NewCollection } from 'src/app/core';
import { modActions } from './mod.actions';

interface State {
  medias: Media[];
  newCollections: NewCollection[];

  isMediaLoaded: boolean;
  isPublishLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  medias: [],
  newCollections: [],

  isMediaLoaded: false,
  isPublishLoaded: false,
  isProcessing: false,
  error: null,
};

export const modFeature = createFeature({
  name: 'mod',
  reducer: createReducer(
    initialState,

    // load media
    on(modActions.loadMedia, (state) => ({
      ...state,
      isMediaLoaded: false,
    })),
    on(modActions.loadMediaSuccess, (state, { medias }) => ({
      ...state,
      medias,
      isMediaLoaded: true,
    })),
    on(modActions.loadMediaFailure, (state, { error }) => ({
      ...state,
      isMediaLoaded: true,
      error,
    })),

    // sanction media
    on(modActions.sanctionMedia, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(modActions.sanctionMediaSuccess, (state, { mediaId }) => ({
      ...state,
      medias: state.medias.filter((media) => media.id !== mediaId),
      isProcessing: false,
    })),
    on(modActions.sanctionMediaFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // load new collections
    on(modActions.loadNewCollections, (state) => ({
      ...state,
      isPublishLoaded: false,
    })),
    on(modActions.loadNewCollectionsSuccess, (state, { newCollections }) => ({
      ...state,
      newCollections,
      isPublishLoaded: true,
    })),
    on(modActions.loadNewCollectionsFailure, (state, { error }) => ({
      ...state,
      isPublishLoaded: true,
      error,
    })),

    // publish new collection
    on(modActions.publishNewCollection, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(modActions.publishNewCollectionSuccess, (state, { newCollectionId }) => ({
      ...state,
      newCollections: state.newCollections.filter(
        (newCollection) => newCollection.id !== newCollectionId
      ),
      isProcessing: false,
    })),
    on(modActions.publishNewCollectionFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    }))
  ),
});
