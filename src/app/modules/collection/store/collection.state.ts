import { createFeature, createReducer, on } from '@ngrx/store';

import { Collection, Item, Media, Tops, User } from 'src/app/core';
import { collectionActions } from './collection.actions';

interface State {
  collection: Collection | null;
  lastCollectors: User[];
  lastMedia: Media[];
  items: Item[];
  media: Media[];
  tops: Tops | null;
  users: User[];

  isLoaded: boolean;
  isItemsLoaded: boolean;
  isMediaLoaded: boolean;
  isTopsLoaded: boolean;
  isUsersLoaded: boolean;

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  collection: null,
  lastCollectors: [],
  lastMedia: [],
  items: [],
  media: [],
  tops: null,
  users: [],

  isLoaded: false,
  isItemsLoaded: false,
  isMediaLoaded: false,
  isTopsLoaded: false,
  isUsersLoaded: false,

  isProcessing: false,
  error: null,
};

export const collectionFeature = createFeature({
  name: 'collection',
  reducer: createReducer(
    initialState,
    on(collectionActions.cleanData, (state) => initialState),
    // on(collectionActions.setCollectionData, (state, { collection }) => ({
    //   ...state,
    //   collection,
    //   isLoaded: true,
    // })),

    // load collection data
    on(collectionActions.loadData, (state) => ({
      ...state,
      isLoaded: false,
      error: null,
    })),
    on(
      collectionActions.loadDataSuccess,
      (state, { collection, lastCollectors, lastMedia }) => ({
        ...state,
        collection,
        lastCollectors,
        lastMedia,
        isLoaded: true,
      })
    ),
    on(collectionActions.loadDataFailure, (state, { error }) => ({
      ...state,
      collection: null,
      lastCollectors: [],
      lastMedia: [],
      isLoaded: true,
      error,
    })),

    // load collection items
    on(collectionActions.loadItems, (state) => ({
      ...state,
      isItemsLoaded: false,
      error: null,
    })),
    on(collectionActions.loadItemsSuccess, (state, { items }) => ({
      ...state,
      items,
      isItemsLoaded: true,
    })),
    on(collectionActions.loadItemsFailure, (state, { error }) => ({
      ...state,
      items: [],
      isItemsLoaded: true,
      error,
    })),

    // add collection
    on(collectionActions.add, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.addSuccess, (state, { authUser }) => {
      return {
        ...state,
        collection: {
          ...state.collection!,
          totalCollecting: (state.collection?.totalCollecting || 0) + 1,
          userData: {
            ...state.collection?.userData,
            collecting: true,
            completed: false,
            wishing: 0,
            trading: 0,
          },
        },
        lastCollectors: [authUser, ...state.lastCollectors],
        isProcessing: false,
      };
    }),
    on(collectionActions.addFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // remove collection
    on(collectionActions.remove, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.removeSuccess, (state, { authUser }) => {
      let totalCollecting = 0;
      if (
        state.collection?.totalCollecting &&
        state.collection?.totalCollecting > 0
      ) {
        totalCollecting = state.collection?.totalCollecting - 1;
      }

      return {
        ...state,
        collection: {
          ...state.collection!,
          totalCollecting,
          userData: {
            ...state.collection?.userData,
            collecting: false,
            completed: undefined,
            wishing: undefined,
            trading: undefined,
            publicComment: undefined,
          },
        },
        lastCollectors: state.lastCollectors.filter(
          (user) => user.id !== authUser.id
        ),
        isProcessing: false,
      };
    }),
    on(collectionActions.removeFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // toogle completed
    on(collectionActions.toggleCompleted, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.toggleCompletedSuccess, (state, { completed }) => ({
      ...state,
      collection: {
        ...state.collection!,
        userData: {
          ...state.collection?.userData!,
          completed,
        },
      },
      isProcessing: false,
    })),
    on(collectionActions.toggleCompletedFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // load collection tops
    on(collectionActions.loadTops, (state) => ({
      ...state,
      isTopsLoaded: false,
      error: null,
    })),
    on(collectionActions.loadTopsSuccess, (state, { tops }) => ({
      ...state,
      tops,
      isTopsLoaded: true,
    })),
    on(collectionActions.loadTopsFailure, (state, { error }) => ({
      ...state,
      tops: null,
      isTopsLoaded: true,
      error,
    })),

    // load collection users
    on(collectionActions.loadUsers, (state) => ({
      ...state,
      isUsersLoaded: false,
      error: null,
    })),
    on(collectionActions.loadUsersSuccess, (state, { users }) => ({
      ...state,
      users,
      isUsersLoaded: true,
    })),
    on(collectionActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      users: [],
      isUsersLoaded: true,
      error,
    })),

    // load collection media
    on(collectionActions.loadMedia, (state) => ({
      ...state,
      isMediaLoaded: false,
      error: null,
    })),
    on(collectionActions.loadMediaSuccess, (state, { media }) => ({
      ...state,
      media,
      isMediaLoaded: true,
    })),
    on(collectionActions.loadMediaFailure, (state, { error }) => ({
      ...state,
      media: [],
      isMediaLoaded: true,
      error,
    })),
  ),
});
