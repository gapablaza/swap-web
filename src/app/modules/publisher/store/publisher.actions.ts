import { createActionGroup, emptyProps, props } from "@ngrx/store";

import { Collection, Publisher } from "src/app/core";

export const publisherActions = createActionGroup({
    source: 'Publisher',
    events: {
        'Clean Data': emptyProps(),

        // load all publishers
        'Load All': emptyProps(),
        'Load All Success': props<{ publishers: Publisher[] }>(),
        'Load All Failure': props<{ error: string }>(),        

        // load one publisher
        'Load': props<{ publisherId: number }>(),
        'Load Success': props<{ publisher: Publisher, lastCollections: Collection[] }>(),
        'Load Failure': props<{ error: string }>(),
    },
});