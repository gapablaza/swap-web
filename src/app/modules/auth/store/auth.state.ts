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
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.autoLogin, (state) => ({
      ...state,
      loading: true,
    })),
    on(authActions.loginWithEmail, (state) => ({
      ...state,
      loading: true,
    })),
    on(authActions.authSuccess, (state, { user, token }) => ({
      ...state,
      isInit: true,
      user,
      token,
      isAuth: true,
      loading: false,
    })),
    on(authActions.authFailure, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,
      loading: false,
    })),
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
    on(authActions.logout, (state) => ({
      ...state,
      isInit: true,
      user: {} as User,
      token: null,
      isAuth: false,
      isFirebaseAuth: false, // TO DO: log out from firebase
      unreads: 0,
      loading: false,
    }))
  ),
});
