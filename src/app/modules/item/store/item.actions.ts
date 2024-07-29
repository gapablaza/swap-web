import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Collection, Item, User } from 'src/app/core';

export const itemActions = createActionGroup({
  source: 'Item',
  events: {
    'Clean Data': emptyProps(),

    // load item data
    'Load Data': props<{ itemId: number }>(),
    'Load Data Success': props<{
      item: Item;
      collection: Collection;
      trading: User[];
      wishing: User[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
