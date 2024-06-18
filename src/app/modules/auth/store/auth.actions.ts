import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from 'src/app/core';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Auto Login': emptyProps(),
    'Login With Email': props<{ email: string; password: string }>(),
    'Auth Success': props<{ user: User; token: string; redirect: boolean }>(),
    'Auth Failure': emptyProps(),

    'Login Firebase': emptyProps(),
    'Login Firebase Success': emptyProps(),
    'Login Firebase Failure': emptyProps(),

    'Login Redirect': props<{ url: string }>(),

    'Load Unreads Success': props<{ unreads: number }>(),
    'Load Unreads Failure': emptyProps(),

    Logout: emptyProps(),
  },
});
