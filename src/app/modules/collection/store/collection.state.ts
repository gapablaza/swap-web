import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  Collection,
  CollectionUserData,
  Item,
  Media,
  Tops,
  User,
} from 'src/app/core';
import { authFeature } from '../../auth/store/auth.state';
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

const updateItemState = (
  items: Item[],
  itemId: number,
  changes: Partial<Item>
) => items.map((i) => (i.id === itemId ? { ...i, ...changes } : i));

const updateUserData = (
  userData: CollectionUserData,
  listType: 'wishlist' | 'tradelist',
  change: number
) => {
  if (listType === 'wishlist') {
    return { ...userData, wishing: (userData.wishing || 0) + change };
  } else {
    return { ...userData, trading: (userData.trading || 0) + change };
  }
};

export const collectionFeature = createFeature({
  name: 'collection',
  reducer: createReducer(
    initialState,
    on(collectionActions.cleanData, (state) => initialState),

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

    // toggle media likes
    on(collectionActions.toggleMediaLike, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(
      collectionActions.toggleMediaLikeSuccess,
      (state, { mediaId, likes }) => {
        let updatedMedia = state.media.map((m) => {
          if (m.id == mediaId) {
            let newTotal = m.totalLikes || 0;
            return {
              ...m,
              likes,
              totalLikes: likes ? newTotal + 1 : newTotal - 1,
            };
          } else {
            return m;
          }
        });

        return {
          ...state,
          media: [...updatedMedia],
          isProcessing: false,
        };
      }
    ),
    on(collectionActions.toggleMediaLikeFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // add image
    on(collectionActions.addImage, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.addImageSuccess, (state, { newMedia }) => ({
      ...state,
      media: [...state.media, newMedia],
      isProcessing: false,
    })),
    on(collectionActions.addImageFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // remove image
    on(collectionActions.removeImage, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.removeImageSuccess, (state, { mediaId }) => ({
      ...state,
      media: state.media.filter((m) => m.id != mediaId),
      isProcessing: false,
    })),
    on(collectionActions.removeImageFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // add comment
    on(collectionActions.addComment, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.addCommentSuccess, (state, { publicComment }) => ({
      ...state,
      collection: {
        ...state.collection!,
        userData: {
          ...state.collection?.userData!,
          publicComment,
        },
        userSummary: {
          ...state.collection?.userSummary!,
          publicComment,
        },
      },
      isProcessing: false,
    })),
    on(collectionActions.addCommentFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // remove comment
    on(collectionActions.removeComment, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(collectionActions.removeCommentSuccess, (state) => ({
      ...state,
      collection: {
        ...state.collection!,
        userData: {
          ...state.collection?.userData!,
          publicComment: undefined,
        },
        userSummary: {
          ...state.collection?.userSummary!,
          publicComment: '',
        },
      },
      isProcessing: false,
    })),
    on(collectionActions.removeCommentFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // Item add
    on(collectionActions.itemAdd, (state, { item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: true }),
      error: null,
    })),
    on(collectionActions.itemAddSuccess, (state, { item, listType }) => ({
      ...state,
      collection: {
        ...state.collection!,
        userData: updateUserData(state.collection?.userData!, listType, 1),
      },
      items: updateItemState(state.items, item.id, {
        [`${listType}`]: true,
        [`${listType}Quantity`]: 1,
        isSaving: false,
      }),
    })),
    on(collectionActions.itemAddFailure, (state, { error, item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: false }),
      error,
    })),

    // Item increment
    on(collectionActions.itemIncrement, (state, { item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: true }),
      error: null,
    })),
    on(
      collectionActions.itemIncrementSuccess,
      (state, { item, newQuantity, listType }) => ({
        ...state,
        items: updateItemState(state.items, item.id, {
          [`${listType}Quantity`]: newQuantity,
          isSaving: false,
        }),
      })
    ),
    on(collectionActions.itemIncrementFailure, (state, { error, item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: false }),
      error,
    })),

    // Item decrement
    on(collectionActions.itemDecrement, (state, { item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: true }),
      error: null,
    })),
    on(
      collectionActions.itemDecrementSuccess,
      (state, { item, newQuantity, listType }) => ({
        ...state,
        items: updateItemState(state.items, item.id, {
          [`${listType}Quantity`]: newQuantity,
          isSaving: false,
        }),
      })
    ),
    on(
      collectionActions.itemDecrementFailure,
      (state, { error, item }) => ({
        ...state,
        items: updateItemState(state.items, item.id, { isSaving: false }),
        error,
      })
    ),
    
    // Item remove
    on(collectionActions.itemRemove, (state, { item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: true }),
      error: null,
    })),
    on(collectionActions.itemRemoveSuccess, (state, { item, listType }) => ({
      ...state,
      collection: {
        ...state.collection!,
        userData: updateUserData(state.collection?.userData!, listType, -1),
      },
      items: updateItemState(state.items, item.id, {
        [`${listType}`]: false,
        [`${listType}Quantity`]: 0,
        isSaving: false,
      }),
    })),
    on(collectionActions.itemRemoveFailure, (state, { error, item }) => ({
      ...state,
      items: updateItemState(state.items, item.id, { isSaving: false }),
      error,
    })),
  ),
  extraSelectors: ({ selectMedia }) => ({
    selectMediaPublished: createSelector(selectMedia, (media) =>
      media.filter((e) => e.mediaTypeId == 1 && e.mediaStatusId == 2)
    ),
    selectMediaForModFromAuthUser: createSelector(
      selectMedia,
      authFeature.selectIsAuth,
      authFeature.selectUser,
      (media, isAuth, authUser) => {
        if (isAuth) {
          return media.filter(
            (m) =>
              m.mediaStatusId == 1 &&
              m.mediaTypeId == 1 &&
              m.user?.data.id == authUser.id
          );
        }

        return [];
      }
    ),
  }),
});
