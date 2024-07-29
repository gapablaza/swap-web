import { createFeature, createReducer, on } from '@ngrx/store';

import { settingsActions } from './settings.actions';

interface State {
  title: string;
  subtitle: string;
  updateEmailRequested: boolean;

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
    on(settingsActions.loadNotifications, (state) => ({
      ...state,
      title: 'Notificaciones',
      subtitle: 'Recibe información directo a tu email',
      isNotificationsLoaded: true,
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

    // // set titles
    // on(settingsActions.setTitles, (state, { title, subtitle }) => ({
    //   ...state,
    //   title,
    //   subtitle,
    // }))
  ),
});
