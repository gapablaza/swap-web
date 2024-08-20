import { createFeature, createReducer, on } from '@ngrx/store';

import { User } from 'src/app/core';
import { authActions } from './auth.actions';

interface State {
  isInit: boolean;
  user: User;
  token: string | null;
  isAuth: boolean;

  isFirebaseInit: boolean;
  isFirebaseAuth: boolean;
  unreads: number;

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  isInit: false,
  user: {} as User,
  token: null,
  isAuth: false,

  isFirebaseInit: false,
  isFirebaseAuth: false,
  unreads: 0,

  isProcessing: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    // login
    on(authActions.autoLogin, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.loginWithEmail, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.loginFacebook, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.authSuccess, (state, { user, token }) => ({
      ...state,
      isInit: true,
      user,
      token,
      isAuth: true,
      isProcessing: false,
    })),
    on(authActions.authFailure, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,
      isProcessing: false,
    })),

    // Firebase
    on(authActions.loginFirebaseSuccess, (state) => ({
      ...state,
      isFirebaseInit: true,
      isFirebaseAuth: true,
    })),
    on(authActions.loginFirebaseFailure, (state) => ({
      ...state,
      isFirebaseInit: true,
      isFirebaseAuth: false,
    })),
    on(authActions.loadUnreadsSuccess, (state, { unreads }) => ({
      ...state,
      unreads,
    })),

    // Signup
    on(authActions.signupEmail, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.signupSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isAuth: true,
      isProcessing: false,
    })),
    on(authActions.signupFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // Reset password
    on(authActions.resetPassword, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.resetPasswordSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(authActions.resetPasswordFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // New password
    on(authActions.newPassword, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.newPasswordSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(authActions.newPasswordFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // update profile
    on(authActions.updateProfile, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.updateProfileSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isProcessing: false,
    })),
    on(authActions.updateProfileFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // update avatar
    on(authActions.updateAvatar, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.updateAvatarSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isProcessing: false,
    })),
    on(authActions.updateAvatarFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // remove avatar
    on(authActions.removeAvatar, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.removeAvatarSuccess, (state) => ({
      ...state,
      user: { ...state.user, image: null },
      isProcessing: false,
    })),
    on(authActions.removeAvatarFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // link facebook
    on(authActions.linkFacebook, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.linkFacebookSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isProcessing: false,
    })),
    on(authActions.linkFacebookFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // link google
    on(authActions.connectPageSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
    })),

    // unlink network
    on(authActions.unlinkNetwork, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.unlinkNetworkSuccess, (state, { network }) => ({
      ...state,
      user: {
        ...state.user,
        facebook: network === 'facebook' ? null : state.user.facebook,
        google: network === 'google' ? null : state.user.google,
      },
      isProcessing: false,
    })),
    on(authActions.unlinkNetworkFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // unread notification
    on(authActions.unreadNotification, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.unreadNotificationSuccess, (state, { notifyUnreads }) => ({
      ...state,
      user: { ...state.user, notifyUnreadMessages: notifyUnreads },
      isProcessing: false,
    })),
    on(authActions.unreadNotificationFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // delete account
    on(authActions.deleteAccount, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.deleteAccountFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // logout
    on(authActions.logoutStart, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(authActions.logoutFinish, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,

      isFirebaseInit: true,
      isFirebaseAuth: false,
      unreads: 0,

      isProcessing: false,
    }))
  ),
});
