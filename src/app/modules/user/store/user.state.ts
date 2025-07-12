import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  Collection,
  EvaluationsApiResponse,
  Media,
  TradesWithUser,
  User,
} from 'src/app/core';
import { userActions } from './user.actions';

interface State {
  user: User;
  tradesWithUser: TradesWithUser | null;
  evaluationsData: EvaluationsApiResponse | null;
  collections: Collection[];
  media: Media[];

  evaluatedRecently: boolean;
  collectionDetails: Collection | null;

  isLoaded: boolean;
  isEvaluationsLoaded: boolean;
  isCollectionsLoaded: boolean;
  isCollectionDetailsLoaded: boolean;
  isMediaLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  user: {} as User,
  tradesWithUser: null,
  evaluationsData: null,
  collections: [],
  media: [],

  evaluatedRecently: false,
  collectionDetails: null,

  isLoaded: false,
  isEvaluationsLoaded: false,
  isCollectionsLoaded: false,
  isCollectionDetailsLoaded: false,
  isMediaLoaded: false,
  isProcessing: false,
  error: null,
};

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(userActions.cleanUserData, (state) => initialState),

    // load profile data
    on(userActions.loadUserData, (state) => ({
      ...state,
      isLoaded: false,
      error: null,
    })),
    on(userActions.loadUserDataSuccess, (state, { user, reset }) => {
      if (reset) {
        return {
          ...state,
          user,
          tradesWithUser: null,
          evaluationsData: null,
          collections: [],
          media: [],
          evaluatedRecently: false,
          isLoaded: true,
        };
      }

      return {
        ...state,
        user,
        isLoaded: true,
      };
    }),
    on(userActions.loadUserDataFailure, (state, { error }) => ({
      ...state,
      user: {} as User,
      isLoaded: true,
      error,
    })),

    // load trades
    on(userActions.loadTradesWithAuthUser, (state) => ({
      ...state,
    })),
    on(
      userActions.loadTradesWithAuthUserSuccess,
      (state, { tradesWithUser }) => ({
        ...state,
        tradesWithUser,
      })
    ),
    on(userActions.loadTradesWithAuthUserFailure, (state, { error }) => ({
      ...state,
      tradesWithUser: null,
      error,
    })),

    // toggle blacklist
    on(userActions.toggleBlacklist, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(userActions.toggleBlacklistSuccess, (state, { blacklist }) => ({
      ...state,
      user: {
        ...state.user,
        inBlacklist: blacklist,
      },
      isProcessing: false,
    })),
    on(userActions.toggleBlacklistFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // User evaluations
    on(userActions.loadUserEvaluations, (state) => ({
      ...state,
      isEvaluationsLoaded: false,
      error: null,
    })),
    on(userActions.loadUserEvaluationsSuccess, (state, { evaluationsData }) => {
      const positives = evaluationsData.evaluations.reduce((acc, item) => {
        return item.evaluationTypeId == 1 ? acc + 1 : acc;
      }, 0);
      const negatives = evaluationsData.evaluations.reduce((acc, item) => {
        return item.evaluationTypeId == 2 ? acc + 1 : acc;
      }, 0);

      return {
        ...state,
        user: {
          ...state.user,
          userSummary: {
            ...state.user.userSummary,
            positives,
            negatives,
          },
        },
        evaluationsData,
        isEvaluationsLoaded: true,
      };
    }),
    on(userActions.loadUserEvaluationsFailure, (state, { error }) => ({
      ...state,
      evaluationsData: null,
      isEvaluationsLoaded: true,
      error,
    })),

    // Add an evaluation
    on(userActions.addEvaluation, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(userActions.addEvaluationSuccess, (state) => ({
      ...state,
      evaluatedRecently: true,
      isProcessing: false,
    })),
    on(userActions.addEvaluationFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // Load collections
    on(userActions.loadUserCollections, (state) => ({
      ...state,
      isCollectionsLoaded: false,
      error: null,
    })),
    on(userActions.loadUserCollectionsSuccess, (state, { collections }) => ({
      ...state,
      collections,
      isCollectionsLoaded: true,
    })),
    on(userActions.loadUserCollectionsFailure, (state, { error }) => ({
      ...state,
      collections: [],
      isCollectionsLoaded: true,
      error,
    })),

    // Load collection details
    on(userActions.loadUserCollectionDetails, (state) => ({
      ...state,
      collectionDetails: null,
      isCollectionDetailsLoaded: false,
      error: null,
    })),
    on(
      userActions.loadUserCollectionDetailsSuccess,
      (state, { collection }) => ({
        ...state,
        collectionDetails: collection,
        isCollectionDetailsLoaded: true,
      })
    ),
    on(userActions.loadUserCollectionDetailsFailure, (state, { error }) => ({
      ...state,
      collectionDetails: null,
      isCollectionDetailsLoaded: true,
      error,
    })),

    // Load media
    on(userActions.loadUserMedia, (state) => ({
      ...state,
      isMediaLoaded: false,
      error: null,
    })),
    on(userActions.loadUserMediaSuccess, (state, { media }) => ({
      ...state,
      media,
      isMediaLoaded: true,
    })),
    on(userActions.loadUserMediaFailure, (state, { error }) => ({
      ...state,
      media: [],
      isMediaLoaded: true,
      error,
    })),

    // toggle media likes
    on(userActions.toggleMediaLike, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(userActions.toggleMediaLikeSuccess, (state, { mediaId, likes }) => ({
      ...state,
      media: state.media.map((media) => {
        if (media.id == mediaId) {
          let totalLikes = likes
            ? (media.totalLikes || 0) + 1
            : (media.totalLikes || 0) - 1;
          return {
            ...media,
            likes,
            totalLikes,
          };
        } else {
          return media;
        }
      }),
      isProcessing: false,
    })),
    on(userActions.toggleMediaLikeFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),

    // set user vote
    on(userActions.setVote, (state) => ({
      ...state,
      isProcessing: true,
      error: null,
    })),
    on(userActions.setVoteSuccess, (state, { vote }) => ({
      ...state,
      user: {
        ...state.user,
        voteStatus: vote,
      },
      isProcessing: false,
    })),
    on(userActions.setVoteFailure, (state, { error }) => ({
      ...state,
      isProcessing: false,
      error,
    })),
  ),
  extraSelectors: ({
    selectTradesWithUser,
    selectEvaluationsData,
    selectMedia,
  }) => ({
    selectTradesShow: createSelector(selectTradesWithUser, (trades) => {
      if (trades?.showTrades) {
        return trades.showTrades;
      } else {
        return false;
      }
    }),
    selectTradesCollections: createSelector(selectTradesWithUser, (trades) => {
      if (trades?.collections) {
        return trades.collections;
      } else {
        return [];
      }
    }),
    selectTradesTotal: createSelector(selectTradesWithUser, (trades) => {
      if (trades?.total) {
        return trades.total;
      } else {
        return 0;
      }
    }),
    selectEvaluations: createSelector(selectEvaluationsData, (data) => {
      return data ? data.evaluations : [];
    }),
    selectEvalutionsDisabled: createSelector(selectEvaluationsData, (data) => {
      return data ? data.disabled : true;
    }),
    selectEvaluationsDisabledData: createSelector(
      selectEvaluationsData,
      (data) => {
        return data ? data.disabledData : undefined;
      }
    ),
    selectImages: createSelector(selectMedia, (media) => {
      return media.filter((m) => m.mediaTypeId == 1 && m.mediaStatusId == 2);
    }),
  }),
});
