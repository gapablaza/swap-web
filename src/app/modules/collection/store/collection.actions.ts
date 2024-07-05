import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Collection, Item, Media, Tops, User } from 'src/app/core';

export const collectionActions = createActionGroup({
  source: 'Collection',
  events: {
    'Clean Data': emptyProps(),
    'Require Auth': emptyProps(),

    // load collection data
    'Load Data': props<{ collectionId: number }>(),
    'Load Data Success': props<{
      collection: Collection;
      lastCollectors: User[];
      lastMedia: Media[];
    }>(),
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
    Add: emptyProps(),
    'Add Success': props<{ message: string; authUser: User }>(),
    'Add Failure': props<{ error: string }>(),

    // remove collection
    Remove: emptyProps(),
    'Remove Success': props<{ message: string; authUser: User }>(),
    'Remove Failure': props<{ error: string }>(),

    // toggle completed
    'Toggle Completed': props<{ completed: boolean }>(),
    'Toggle Completed Success': props<{
      message: string;
      completed: boolean;
    }>(),
    'Toggle Completed Failure': props<{ error: string }>(),

    // add comment
    'Add Comment': props<{ publicComment: string }>(),
    'Add Comment Success': props<{ message: string, publicComment: string }>(),
    'Add Comment Failure': props<{ error: string }>(),

    // remove comment
    'Remove Comment': emptyProps(),
    'Remove Comment Success': props<{ message: string }>(),
    'Remove Comment Failure': props<{ error: string }>(),

    // toggle media like
    'Toggle Media Like': props<{ mediaId: number; likes: boolean }>(),
    'Toggle Media Like Success': props<{
      message: string;
      mediaId: number;
      likes: boolean;
    }>(),
    'Toggle Media Like Failure': props<{ error: string }>(),

    // add image
    'Add Image': emptyProps(),
    'Add Image Success': props<{ message: string; newMedia: Media }>(),
    'Add Image Failure': props<{ error: string }>(),

    // remove image
    'Remove Image': props<{ mediaId: number }>(),
    'Remove Image Success': props<{ message: string; mediaId: number }>(),
    'Remove Image Failure': props<{ error: string }>(),

    // Item add
    'Item Add': props<{ item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Add Success': props<{ message: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Add Failure': props<{ error: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
    
    // Item increment
    'Item Increment': props<{ item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Increment Success': props<{ message: string, item: Item, newQuantity: number, listType: 'wishlist' | 'tradelist' }>(),
    'Item Increment Failure': props<{ error: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
    
    // Item decrement
    'Item Decrement': props<{ item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Decrement Success': props<{ message: string, item: Item, newQuantity: number, listType: 'wishlist' | 'tradelist' }>(),
    'Item Decrement Failure': props<{ error: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
    
    // Item remove
    'Item Remove': props<{ item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Remove Success': props<{ message: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
    'Item Remove Failure': props<{ error: string, item: Item, listType: 'wishlist' | 'tradelist' }>(),
  },
});
