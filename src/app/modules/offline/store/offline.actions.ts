import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Collection } from 'src/app/core';

export const offlineActions = createActionGroup({
  source: 'Offline',
  events: {
    'Offline Page Opened': emptyProps(),
    'Offline Page Closed': emptyProps(),

    // load online collections
    'Load Online User Collections': emptyProps(),
    'Load Online User Collections Success': props<{ collections: Collection[] }>(),
    'Load Online User Collections Failure': emptyProps(),

    // load offline collections
    'Load Offline User Collections': emptyProps(),
    'Load Offline User Collections Success': props<{ collections: Collection[] }>(),
    'Load Offline User Collections Failure': emptyProps(),
    
    // save user collection for offline access
    'Save Offline User Collection': props<{ collection: Collection }>(),
    'Save Offline User Collection Success': emptyProps(),
    'Save Offline User Collection Failure': emptyProps(),

    // sync user collections for offline access
    'Sync User Collections': emptyProps(),
    'Sync User Collections Success': emptyProps(),
    'Sync User Collections Failure': emptyProps(),

    'Sync User Collections Periodically': emptyProps(),
  },
});
