import { createFeature, createReducer, on } from '@ngrx/store';

import { User } from 'src/app/core';
import { authActions } from './auth.actions';

interface State {
  isInit: boolean;
  user: User;
  token: string | null;
  isAuth: boolean;
  isFirebaseAuth: boolean;
  unreads: number;

  loading: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  isInit: false, 
  user: {} as User,
  token: null,
  isAuth: false,
  isFirebaseAuth: false,
  unreads: 0,

  loading: false,
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
      loading: true,
      isProcessing: true,
    })),
    on(authActions.loginWithEmail, (state) => ({
      ...state,
      loading: true,
      isProcessing: true,
    })),
    on(authActions.loginFacebook, (state) => ({
      ...state,
      loading: true,
      isProcessing: true,
    })),
    on(authActions.authSuccess, (state, { user, token }) => ({
      ...state,
      isInit: true,
      user,
      token,
      isAuth: true,
      loading: false,
      isProcessing: false,
    })),
    on(authActions.authFailure, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,
      loading: false,
      isProcessing: false,
    })),

    // Firebase
    on(authActions.loginFirebaseSuccess, (state) => ({
      ...state,
      isFirebaseAuth: true,
    })),
    on(authActions.loginFirebaseFailure, (state) => ({
      ...state,
      isFirebaseAuth: false,
    })),
    on(authActions.loadUnreadsSuccess, (state, { unreads }) => ({
      ...state,
      unreads
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
    // on(authActions.deleteAccountSuccess, (state) => ({
    //   ...state,
    //   user: {} as User,
    //   token: null,
    //   isAuth: false,
    //   isProcessing: false,
    // })),
    on(authActions.deleteAccountFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // logout
    on(authActions.logout, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,
      isFirebaseAuth: false, // TO DO: log out from firebase
      unreads: 0,
      isProcessing: false,
      loading: false,
    }))
  ),
});
