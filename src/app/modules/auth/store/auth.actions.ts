import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from 'src/app/core';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    // signup with email
    'Signup Email': props<{ name: string; email: string; password: string }>(),
    'Signup Success': props<{
      message: string;
      user: User;
      token: string;
      redirect: boolean;
    }>(),
    'Signup Failure': props<{ error: string }>(),

    // signup page opened / destroyed
    'Signup Page Opened': emptyProps(),
    'Signup Page Destroyed': emptyProps(),

    // reset password
    'Reset Password': props<{ email: string }>(),
    'Reset Password Success': props<{ message: string }>(),
    'Reset Password Failure': props<{ error: string }>(),

    // new password
    'New Password': props<{
      newPassword: string;
      userId: number;
      hash: string;
    }>(),
    'New Password Success': props<{ message: string }>(),
    'New Password Failure': props<{ error: string }>(),

    // general login
    'Auto Login': emptyProps(),
    'Login With Email': props<{ email: string; password: string }>(),
    'Login Facebook': emptyProps(),
    'Auth Success': props<{ user: User; token: string; redirect: boolean }>(),
    'Auth Failure': emptyProps(),

    // login page opened / destroyed
    'Login Page Opened': emptyProps(),
    'Login Page Destroyed': emptyProps(),

    // Firebase login
    'Login Firebase': emptyProps(),
    'Login Firebase Success': emptyProps(),
    'Login Firebase Failure': emptyProps(),

    // unreads
    'Load Unreads Success': props<{ unreads: number }>(),
    'Load Unreads Failure': emptyProps(),

    // update profile
    'Update Profile': props<{
      active: boolean;
      name: string;
      bio?: string;
      addressComponents: string;
    }>(),
    'Update Profile Success': props<{
      message: string;
      user: User;
      token: string;
    }>(),
    'Update Profile Failure': props<{ error: string }>(),

    // update avatar
    'Update Avatar': props<{ image64: string }>(),
    'Update Avatar Success': props<{
      message: string;
      user: User;
      token: string;
    }>(),
    'Update Avatar Failure': props<{ error: string }>(),

    // remove avatar
    'Remove Avatar': emptyProps(),
    'Remove Avatar Success': props<{ message: string }>(),
    'Remove Avatar Failure': props<{ error: string }>(),

    // settings connect page opened / destroyed *** for Google
    'Connect Page Opened': emptyProps(),
    'Connect Page Destroyed': emptyProps(),
    'Connect Page Success': props<{
      message: string;
      user: User;
      token: string;
    }>(),
    'Connect Page Failure': props<{ error: string }>(),

    // link Facebook
    'Link Facebook': emptyProps(),
    'Link Facebook Success': props<{
      message: string;
      user: User;
      token: string;
    }>(),
    'Link Facebook Failure': props<{ error: string }>(),

    // unlink network
    'Unlink Network': props<{ network: 'facebook' | 'google' }>(),
    'Unlink Network Success': props<{
      message: string;
      network: 'facebook' | 'google';
    }>(),
    'Unlink Network Failure': props<{ error: string }>(),

    // set unread notification
    'Unread Notification': props<{ notifyUnreads: boolean }>(),
    'Unread Notification Success': props<{
      message: string;
      notifyUnreads: boolean;
    }>(),
    'Unread Notification Failure': props<{ error: string }>(),

    // delete account
    'Delete Account': emptyProps(),
    'Delete Account Success': props<{ message: string }>(),
    'Delete Account Failure': props<{ error: string }>(),

    'Login Redirect': props<{ url: string }>(),

    // logout
    'Logout Start': emptyProps(),
    'Logout Finish': emptyProps(),

    // online Users
    'Set Online Status': emptyProps(),
    'Set Offline Status': emptyProps(),
    'Get Online Users Count': emptyProps(),
    'Set Online Users Count': props<{ count: number }>(),
  },
});
