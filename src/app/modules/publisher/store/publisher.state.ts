import { createFeature, createReducer, on } from '@ngrx/store';

import { Collection, Publisher } from 'src/app/core';
import { publisherActions } from './publisher.actions';

interface State {
  publishers: Publisher[];
  publisher: Publisher | null;
  lastCollections: Collection[];

  isAllLoaded: boolean;
  isOneLoaded: boolean;

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  publishers: [],
  publisher: null,
  lastCollections: [],

  isAllLoaded: false,
  isOneLoaded: false,

  isProcessing: false,
  error: null,
};

export const publisherFeature = createFeature({
  name: 'publisher',
  reducer: createReducer(
    initialState,
    on(publisherActions.cleanData, (state) => initialState),

    // load all publishers
    on(publisherActions.loadAll, (state) => ({
      ...state,
      isAllLoaded: false,
      error: null,
    })),
    on(publisherActions.loadAllSuccess, (state, { publishers }) => ({
      ...state,
      publishers,
      isAllLoaded: true,
    })),
    on(publisherActions.loadAllFailure, (state, { error }) => ({
      ...state,
      publishers: [],
      isAllLoaded: true,
      error,
    })),

    // load one publisher
    on(publisherActions.load, (state) => ({
      ...state,
      publisher: null,
      lastCollections: [],
      isOneLoaded: false,
      error: null,
    })),
    on(publisherActions.loadSuccess, (state, { publisher, lastCollections }) => ({
      ...state,
      publisher,
      lastCollections,
      isOneLoaded: true,
    })),
    on(publisherActions.loadFailure, (state, { error }) => ({
      ...state,
      isOneLoaded: true,
      error,
    })),
  ),
});
