// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  cloudinary: {
    uploadPreset: 'XXXXXXXX',
    cloudName: 'XXXXXXXX',
    site: 'dev|prod',
  },
  facebook: {
    token: 'XXXXXXXXXXXXX',
  },
  firebase: {
    projectId: 'XXXXXXXXXXXXX',
    appId: 'XXXXXXXXXXXXX',
    databaseURL: 'https://XXXXXXXXXXXXX.firebaseio.com',
    storageBucket: 'XXXXXXXXXXXXX.appspot.com',
    locationId: 'XXXXXXXXXXXXX',
    apiKey: 'XXXXXXXXXXXXX',
    authDomain: 'XXXXXXXXXXXXX.firebaseapp.com',
    messagingSenderId: 'XXXXXXXXXXXXX',
  },
  google: {
    apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    token: 'XXXXXXXXXXXXX-XXXXXXXXXXXXX.apps.googleusercontent.com',
  },
  analytics: 'X-XXXXXXXXXX',
  vapidKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  production: false,
  api_url: 'https://api.intercambialaminas.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
