import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const settingsActions = createActionGroup({
  source: 'Settings',
  events: {
    // load settings sections
    'Load Settings': emptyProps(),
    'Load Profile': emptyProps(),
    'Load Notifications': emptyProps(),
    'Load Delete': emptyProps(),

    // update email
    'Update Email': props<{ email: string }>(),
    'Update Email Success': props<{ message: string }>(),
    'Update Email Failure': props<{ error: string }>(),

    // 'Load Profile Success': props<{ profile: any }>(),
    // 'Load Profile Failure': props<{ error: string }>(),

    // set titles
    // 'Set Titles': props<{ title: string; subtitle: string }>(),
  },
});
