import { createActionGroup, emptyProps, props } from "@ngrx/store";

import { Collection, Item, Media, Tops, User } from "src/app/core";

export const collectionActions = createActionGroup({
    source: 'Collection',
    events: {
        'Clean Data': emptyProps(),
        // 'Set Data': props<{ collection: any }>(),

        // load collection data
        'Load Data': props<{ collectionId: number }>(),
        'Load Data Success': props<{ collection: Collection, lastCollectors: User[], lastMedia: Media[] }>(),
        'Load Data Failure': props<{ error: string }>(),

        // Load collection items
        'Load Items': emptyProps(),
        'Load Items Success': props<{ items: Item[] }>(),
        'Load Items Failure': props<{ error: string }>(),

        // load collection media
        'Load Media': emptyProps(),
        'Load Media Success': props<{ media: Media[] }>(),
        'Load Media Failure': props<{ error: string }>(),

        // load collection tops
        'Load Tops': emptyProps(),
        'Load Tops Success': props<{ tops: Tops }>(),
        'Load Tops Failure': props<{ error: string }>(),

        // load collection users
        'Load Users': emptyProps(),
        'Load Users Success': props<{ users: User[] }>(),
        'Load Users Failure': props<{ error: string }>(),

        // add collection
        'Add': emptyProps(),
        'Add Success': props<{ message: string, authUser: User }>(),
        'Add Failure': props<{ error: string }>(),

        // remove collection
        'Remove': emptyProps(),
        'Remove Success': props<{ message: string, authUser: User }>(),
        'Remove Failure': props<{ error: string }>(),

        // toggle completed
        'Toggle Completed': props<{ completed: boolean }>(),
        'Toggle Completed Success': props<{ message: string, completed: boolean }>(),
        'Toggle Completed Failure': props<{ error: string }>(),

        // add comment
        'Add Comment': props<{ comment: string }>(),
        'Add Comment Success': props<{ message: string }>(),
        'Add Comment Failure': props<{ error: string }>(),

        // remove comment
        'Remove Comment': emptyProps(),
        'Remove Comment Success': props<{ message: string }>(),
        'Remove Comment Failure': props<{ error: string }>(),
    },
})