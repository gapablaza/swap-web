import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Media, NewCollection } from 'src/app/core';

export const modActions = createActionGroup({
  source: 'Mod',
  events: {
    // load media
    'Load Media': emptyProps(),
    'Load Media Success': props<{ medias: Media[] }>(),
    'Load Media Failure': props<{ error: string }>(),

    // sanction media
    'Sanction Media': props<{ mediaId: number; sanctionId: 2 | 3 }>(),
    'Sanction Media Success': props<{ message: string; mediaId: number }>(),
    'Sanction Media Failure': props<{ error: string }>(),

    // load new collections
    'Load New Collections': emptyProps(),
    'Load New Collections Success': props<{ newCollections: NewCollection[] }>(),
    'Load New Collections Failure': props<{ error: string }>(),

    // publish new collection
    'Publish New Collection': props<{ newCollectionId: number; security: string }>(),
    'Publish New Collection Success': props<{ message: string; newCollectionId: number }>(),
    'Publish New Collection Failure': props<{ error: string }>(),
  },
});
