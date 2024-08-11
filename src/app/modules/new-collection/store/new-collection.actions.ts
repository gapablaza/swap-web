import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ChecklistItem,
  History,
  ItemType,
  NewChecklist,
  NewCollection,
  NewCollectionComment,
  NewCollectionForm,
  Pagination,
  Publisher,
  User,
} from 'src/app/core';
import { NewCollectionsRouteParamsState } from './new-collection.state';

export const newCollectionActions = createActionGroup({
  source: 'New Collection',
  events: {
    'Clean Data': emptyProps(),

    // load route params
    'Load Params': props<{ params: NewCollectionsRouteParamsState }>(),
    'Load Params Success': props<{ params: NewCollectionsRouteParamsState }>(),
    'Load Params Failure': props<{ error: string }>(),

    // load new collections
    'Load Data': emptyProps(),
    'Load Data Success': props<{
      newCollections: NewCollection[];
      paginator: Pagination;
    }>(),
    'Load Data Failure': props<{ error: string }>(),

    // load add or edit page
    'Load Add Or Edit': props<{ collectionId?: string }>(),
    'Load Add Or Edit Success': props<{
      newCollection: NewCollection | null;
    }>(),
    'Load Add Or Edit Failure': props<{ error: string }>(),

    // load new collection
    'Load Collection': props<{ collectionId: number }>(),
    'Load Collection Success': props<{
      newCollection: NewCollection;
      checklists: NewChecklist[];
      votes: User[];
    }>(),
    'Load Collection Failure': props<{ error: string }>(),

    // load collection history
    'Load History': emptyProps(),
    'Load History Success': props<{ history: History[] }>(),
    'Load History Failure': props<{ error: string }>(),

    // load collection comments
    'Load Comments': emptyProps(),
    'Load Comments Success': props<{ comments: NewCollectionComment[] }>(),
    'Load Comments Failure': props<{ error: string }>(),

    // add comment
    'Add Comment': props<{ commentMsg: string }>(),
    'Add Comment Success': props<{
      message: string;
      comment: NewCollectionComment;
    }>(),
    'Add Comment Failure': props<{ error: string }>(),

    // load item types
    'Load Item Types': emptyProps(),
    'Load Item Types Success': props<{ itemTypes: ItemType[] }>(),
    'Load Item Types Failure': props<{ error: string }>(),

    // load publishers
    'Load Publishers': emptyProps(),
    'Load Publishers Success': props<{ publishers: Publisher[] }>(),
    'Load Publishers Failure': props<{ error: string }>(),

    // vote
    Vote: props<{ vote: boolean }>(),
    'Vote Success': props<{ message: string; vote: boolean; user: User }>(),
    'Vote Failure': props<{ error: string }>(),

    // add checklist
    'Add Checklist': props<{ checklistItems: ChecklistItem[] }>(),
    'Add Checklist Success': props<{ message: string }>(),
    'Add Checklist Failure': props<{ error: string }>(),

    // set checklist
    'Set Checklist': props<{ checklistId: number }>(),
    'Set Checklist Success': props<{ message: string; checklistId: number }>(),
    'Set Checklist Failure': props<{ error: string }>(),

    // add new collection
    'Add New Collection': props<{ newCollectionForm: NewCollectionForm }>(),
    'Add New Collection Success': props<{ message: string }>(),
    'Add New Collection Failure': props<{ error: string }>(),
    
    // update new collection
    'Update New Collection': props<{ newCollectionForm: NewCollectionForm }>(),
    'Update New Collection Success': props<{ message: string }>(),
    'Update New Collection Failure': props<{ error: string }>(),

    // sanction new collection
    'Sanction New Collection': props<{ newStatus: number; comment: string }>(),
    'Sanction New Collection Success': props<{ message: string }>(),
    'Sanction New Collection Failure': props<{ error: string }>(),
  },
});
