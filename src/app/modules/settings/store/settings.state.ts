import { createFeature, createReducer, on } from '@ngrx/store';

import { settingsActions } from './settings.actions';
import { User } from 'src/app/core';

interface State {
  title: string;
  subtitle: string;
  updateEmailRequested: boolean;
  blacklist: User[];

  isLoaded: boolean;
  isProfileLoaded: boolean;
  isNotificationsLoaded: boolean;
  isDeleteLoaded: boolean;
  isConnectedLoaded: boolean;
  isBlacklistLoaded: boolean;

  isProcessing: boolean;
  error: string | null;
}

const initialState: State = {
  title: 'Editar perfil',
  subtitle: 'Define tus datos de acceso público',
  updateEmailRequested: false,
  blacklist: [],

  isLoaded: false,
  isProfileLoaded: false,
  isNotificationsLoaded: false,
  isDeleteLoaded: false,
  isConnectedLoaded: false,
  isBlacklistLoaded: false,

  isProcessing: false,
  error: null,
};

export const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,

    // load sections
    on(settingsActions.loadSettings, (state) => ({
      ...state,
      isLoaded: true,
    })),
    on(settingsActions.loadProfile, (state) => ({
      ...state,
      title: 'Editar perfil',
      subtitle: 'Define tus datos de acceso público',
      isProfileLoaded: true,
    })),
    on(settingsActions.loadConnect, (state) => ({
      ...state,
      title: 'Conéctate',
      subtitle: 'Métodos adicionales de inicio',
      isConnectedLoaded: true,
    })),
    on(settingsActions.loadNotifications, (state) => ({
      ...state,
      title: 'Notificaciones',
      subtitle: 'Recibe información directo a tu email',
      isNotificationsLoaded: true,
    })),
    on(settingsActions.loadBlacklist, (state) => ({
      ...state,
      title: 'Bloqueados',
      subtitle: 'Lista de usuarios bloqueados',
      isBlacklistLoaded: true,
    })),
    on(settingsActions.loadDelete, (state) => ({
      ...state,
      title: 'Eliminar cuenta',
      subtitle: 'Eliminina de manera definitiva tus datos',
      isDeleteLoaded: true,
    })),

    // update email
    on(settingsActions.updateEmail, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(settingsActions.updateEmailSuccess, (state) => ({
      ...state,
      updateEmailRequested: true,
      isProcessing: false,
    })),
    on(settingsActions.updateEmailFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // load blacklist
    on(settingsActions.loadBlacklist, (state) => ({
      ...state,
      isBlacklistLoaded: false,
    })),
    on(settingsActions.loadBlacklistSuccess, (state, { blacklist }) => ({
      ...state,
      blacklist,
      isBlacklistLoaded: true,
    })),
    on(settingsActions.loadBlacklistFailure, (state) => ({
      ...state,
      isBlacklistLoaded: true,
    })),

    // remove blacklist
    on(settingsActions.removeBlacklist, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(settingsActions.removeBlacklistSuccess, (state, { userId }) => ({
      ...state,
      blacklist: state.blacklist.filter((user) => user.id !== userId),
      isProcessing: false,
    })),
    on(settingsActions.removeBlacklistFailure, (state) => ({
      ...state,
      isProcessing: false,
    }))
  ),
});
