import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  History,
  ItemType,
  NewChecklist,
  NewCollection,
  NewCollectionComment,
  Pagination,
  Publisher,
  User,
} from 'src/app/core';
import { newCollectionActions } from './new-collection.actions';
import { authFeature } from '../../auth/store/auth.state';

export interface NewCollectionsRouteParamsState {
  page?: string;
  sortBy?: string;
  status?: string;
  q?: string;
}

export interface NewCollectionsState {
  newCollections: NewCollection[];
  itemTypes: ItemType[];
  publishers: Publisher[];

  newCollection: NewCollection | null;
  newCollectionComments: NewCollectionComment[];
  newCollectionRecentlyCommented: boolean;
  newCollectionChecklists: NewChecklist[];
  newCollectionVotes: User[];
  newCollectionHistory: History[];

  pageSelected: number;
  sortSelected: string;
  statusSelected: number;
  query: string;

  paginator: Pagination;
  isLoaded: boolean;
  isNewCollectionLoaded: boolean;
  isHistoryLoaded: boolean;
  isCommentsLoaded: boolean;
  isNewChecklistLoaded: boolean;
  isAddOrEditLoaded: boolean;
  isProcessing: boolean;
}

export const initialState: NewCollectionsState = {
  newCollections: [],
  itemTypes: [],
  publishers: [],

  newCollection: null,
  newCollectionComments: [],
  newCollectionRecentlyCommented: false,
  newCollectionChecklists: [],
  newCollectionVotes: [],
  newCollectionHistory: [],

  pageSelected: 1,
  sortSelected: 'requested-DESC',
  statusSelected: 0,
  query: '',

  paginator: {} as Pagination,
  isLoaded: false,
  isNewCollectionLoaded: false,
  isHistoryLoaded: false,
  isCommentsLoaded: false,
  isNewChecklistLoaded: false,
  isAddOrEditLoaded: false,
  isProcessing: false,
};

export const newCollectionFeature = createFeature({
  name: 'newCollection',
  reducer: createReducer(
    initialState,

    // load and save route params
    on(newCollectionActions.loadParams, (state) => ({
      ...state,
      isLoaded: false,
    })),
    on(newCollectionActions.loadParamsSuccess, (state, { params }) => {
      let pageSelected =
        params.page === undefined
          ? initialState.pageSelected
          : parseInt(params.page);
      let sortSelected =
        params.sortBy === undefined ? initialState.sortSelected : params.sortBy;
      let statusSelected =
        params.status === undefined
          ? initialState.statusSelected
          : parseInt(params.status);
      let query = params.q === undefined ? initialState.query : params.q;

      return {
        ...state,
        pageSelected,
        sortSelected,
        statusSelected,
        query,
      };
    }),
    on(newCollectionActions.loadParamsFailure, (state) => ({
      ...state,
    })),

    // load new collections
    on(newCollectionActions.loadData, (state) => ({
      ...state,
      isLoaded: false,
    })),
    on(
      newCollectionActions.loadDataSuccess,
      (state, { newCollections, paginator }) => ({
        ...state,
        newCollections,
        paginator,
        isLoaded: true,
      })
    ),
    on(newCollectionActions.loadDataFailure, (state) => ({
      ...state,
      isLoaded: true,
    })),

    // load add or edit
    on(newCollectionActions.loadAddOrEdit, (state) => ({
      ...state,
      isAddOrEditLoaded: false,
    })),
    on(
      newCollectionActions.loadAddOrEditSuccess,
      (state, { newCollection }) => ({
        ...state,
        newCollection,
        isAddOrEditLoaded: true,
      })
    ),
    on(newCollectionActions.loadAddOrEditFailure, (state) => ({
      ...state,
      isAddOrEditLoaded: true,
    })),

    // load new collection
    on(newCollectionActions.loadCollection, (state) => ({
      ...state,
      newCollection: null,
      newCollectionComments: [],
      newCollectionRecentlyCommented: false,
      newCollectionChecklists: [],
      newCollectionVotes: [],
      newCollectionHistory: [],
      isNewCollectionLoaded: false,
    })),
    on(
      newCollectionActions.loadCollectionSuccess,
      (state, { newCollection, checklists, votes }) => ({
        ...state,
        newCollection,
        newCollectionChecklists: checklists,
        newCollectionVotes: votes,
        isNewCollectionLoaded: true,
      })
    ),
    on(newCollectionActions.loadCollectionFailure, (state) => ({
      ...state,
      isNewCollectionLoaded: true,
    })),

    // load history
    on(newCollectionActions.loadHistory, (state) => ({
      ...state,
      isHistoryLoaded: false,
    })),
    on(newCollectionActions.loadHistorySuccess, (state, { history }) => ({
      ...state,
      newCollectionHistory: history,
      isHistoryLoaded: true,
    })),
    on(newCollectionActions.loadHistoryFailure, (state) => ({
      ...state,
      isHistoryLoaded: true,
    })),

    // load item types
    on(newCollectionActions.loadItemTypes, (state) => ({
      ...state,
    })),
    on(newCollectionActions.loadItemTypesSuccess, (state, { itemTypes }) => ({
      ...state,
      itemTypes,
    })),
    on(newCollectionActions.loadItemTypesFailure, (state) => ({
      ...state,
    })),

    // load publishers
    on(newCollectionActions.loadPublishers, (state) => ({
      ...state,
    })),
    on(newCollectionActions.loadPublishersSuccess, (state, { publishers }) => ({
      ...state,
      publishers,
    })),
    on(newCollectionActions.loadPublishersFailure, (state) => ({
      ...state,
    })),

    // load comments
    on(newCollectionActions.loadComments, (state) => ({
      ...state,
      isCommentsLoaded: false,
    })),
    on(newCollectionActions.loadCommentsSuccess, (state, { comments }) => ({
      ...state,
      newCollectionComments: comments,
      isCommentsLoaded: true,
    })),
    on(newCollectionActions.loadCommentsFailure, (state) => ({
      ...state,
      isCommentsLoaded: true,
    })),

    // add comment
    on(newCollectionActions.addComment, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.addCommentSuccess, (state, { comment }) => ({
      ...state,
      newCollectionComments: [...state.newCollectionComments, comment],
      newCollectionRecentlyCommented: true,
      isProcessing: false,
    })),
    on(newCollectionActions.addCommentFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // vote
    on(newCollectionActions.vote, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.voteSuccess, (state, { vote, user }) => {
      if (vote) {
        return {
          ...state,
          newCollectionVotes: [...state.newCollectionVotes, user],
          isProcessing: false,
        };
      } else {
        return {
          ...state,
          newCollectionVotes: state.newCollectionVotes.filter(
            (voter) => voter.id !== user.id
          ),
          isProcessing: false,
        };
      }
    }),
    on(newCollectionActions.voteFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // add checklist
    on(newCollectionActions.addChecklist, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.addChecklistSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(newCollectionActions.addChecklistFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // set checklist
    on(newCollectionActions.setChecklist, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.setChecklistSuccess, (state, { checklistId }) => ({
      ...state,
      newCollection:
        state.newCollection !== null
          ? {
              ...state.newCollection,
              checklistId,
            }
          : null,
      isProcessing: false,
    })),
    on(newCollectionActions.setChecklistFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // add new collection
    on(newCollectionActions.addNewCollection, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.addNewCollectionSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(newCollectionActions.addNewCollectionFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // update new collection
    on(newCollectionActions.updateNewCollection, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.updateNewCollectionSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(newCollectionActions.updateNewCollectionFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // sanction new collection
    on(newCollectionActions.sanctionNewCollection, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(newCollectionActions.sanctionNewCollectionSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(newCollectionActions.sanctionNewCollectionFailure, (state) => ({
      ...state,
      isProcessing: false,
    }))
  ),
  extraSelectors: ({
    selectPageSelected,
    selectSortSelected,
    selectStatusSelected,
    selectQuery,

    selectNewCollection,
    selectNewCollectionVotes,
    selectNewCollectionComments,
    selectNewCollectionRecentlyCommented,
    selectPublishers,
  }) => ({
    selectRouteParams: createSelector(
      selectPageSelected,
      selectSortSelected,
      selectStatusSelected,
      selectQuery,
      (page, sortBy, status, query) => ({ page, sortBy, status, query })
    ),
    selectNewCollectionVotesOrdered: createSelector(
      selectNewCollectionVotes,
      (votes) =>
        [...votes].sort((a, b) => {
          return (a.displayName || '').toLocaleLowerCase() >
            (b.displayName || '').toLocaleLowerCase()
            ? 1
            : -1;
        })
    ),
    selectNewCollectionCommentsOrdered: createSelector(
      selectNewCollectionComments,
      (comments) =>
        [...comments].sort((a, b) => {
          return a.created > b.created ? 1 : -1;
        })
    ),
    selectCanComment: createSelector(
      selectNewCollection,
      selectNewCollectionRecentlyCommented,
      authFeature.selectUser,
      (newCollection, commented, authUser) => {
        return (
          !authUser.disabled &&
          !commented &&
          authUser.daysSinceRegistration >= 30 &&
          [1, 2, 3, 4].includes(newCollection!.statusId)
        );
      }
    ),
    selectCanVote: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return !authUser.disabled && newCollection?.statusId != 5;
      }
    ),
    selectHasVoted: createSelector(
      selectNewCollectionVotes,
      authFeature.selectUser,
      (votes, authUser) => {
        return votes.some((vote) => vote.id == authUser.id);
      }
    ),
    selectCanAddChecklist: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return (
          !authUser.disabled &&
          authUser.daysSinceRegistration >= 30 &&
          ([1, 2].includes(newCollection!.statusId) ||
            ([1, 2, 3, 4].includes(newCollection!.statusId) &&
              authUser.id == 1))
        );
      }
    ),
    selectCanSetChecklist: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return (
          !authUser.disabled &&
          (([1, 2].includes(newCollection!.statusId) && authUser.isMod) ||
            ([1, 2, 3, 4].includes(newCollection!.statusId) &&
              authUser.id == 1))
        );
      }
    ),
    selectCanSend: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return (
          !authUser.disabled &&
          newCollection?.statusId == 2 &&
          authUser.id == newCollection?.user.data?.id
        );
      }
    ),
    selectCanSanction: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return (
          !authUser.disabled &&
          ((newCollection?.statusId == 1 && authUser.isMod) ||
            ([1, 2, 3, 4].includes(newCollection!.statusId) &&
              authUser.id == 1))
        );
      }
    ),
    selectCanUpdate: createSelector(
      selectNewCollection,
      authFeature.selectUser,
      (newCollection, authUser) => {
        return (
          !authUser.disabled &&
          (([1, 2].includes(newCollection!.statusId) && authUser.isMod) ||
            (newCollection?.statusId == 2 &&
              authUser.id == newCollection?.user.data?.id) ||
            ([1, 2, 3, 4].includes(newCollection!.statusId) &&
              authUser.id == 1))
        );
      }
    ),
    selectPublishersOrdered: createSelector(selectPublishers, (publishers) =>
      [...publishers].sort((a, b) => {
        return (a.name || '').toLocaleLowerCase() >
          (b.name || '').toLocaleLowerCase()
          ? 1
          : -1;
      })
    ),
  }),
});
