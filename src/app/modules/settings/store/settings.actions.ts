import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from 'src/app/core';

export const settingsActions = createActionGroup({
  source: 'Settings',
  events: {
    // load settings sections
    'Load Settings': emptyProps(),
    'Load Profile': emptyProps(),
    'Load Connect': emptyProps(),
    'Load Notifications': emptyProps(),
    'Load Blacklist': emptyProps(),
    'Load Delete': emptyProps(),

    // update email
    'Update Email': props<{ email: string }>(),
    'Update Email Success': props<{ message: string }>(),
    'Update Email Failure': props<{ error: string }>(),

    // blacklist
    'Load Blacklist Success': props<{ blacklist: User[] }>(),
    'Load Blacklist Failure': props<{ error: string }>(),

    // remove blacklist
    'Remove Blacklist': props<{ userId: number }>(),
    'Remove Blacklist Success': props<{ message: string, userId: number }>(),
    'Remove Blacklist Failure': props<{ error: string }>(),
  },
});
