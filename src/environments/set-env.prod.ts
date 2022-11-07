const setEnvProd = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.prod.ts` file path
  const targetProdPath = './src/environments/environment.prod.ts';
  // Load node modules
  const appVersion = require('../../package.json').version;

  // Genera archivo vacío que será reemplazado al hacer la build
  writeFile('./src/environments/environment.ts', '', (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated empty`);
    }
  });

  // Obtiene variables desde .env.prod
  require('dotenv').config({
    path: 'src/environments/.env.prod',
  });

  // `environment.prod.ts` file structure
  const envProdConfigFile = `import packageJson from '../../package.json';
  
  export const environment = {
      cloudinary: {
        uploadPreset: '${process.env['CLOUDINARY_UPLOADPRESET']}',
        cloudName: '${process.env['CLOUDINARY_CLOUDNAME']}',
        site: '${process.env['CLOUDINARY_SITE']}',
      },
      facebook: {
        token: '${process.env['FACEBOOK_TOKEN']}',
      },
      firebase: {
          projectId: '${process.env['FIREBASE_PROJECTID']}',
          appId: '${process.env['FIREBASE_APPID']}',
          databaseURL: '${process.env['FIREBASE_DATABASEURL']}',
          storageBucket: '${process.env['FIREBASE_STORAGEBUCKET']}',
          locationId: '${process.env['FIREBASE_LOCATIONID']}',
          apiKey: '${process.env['FIREBASE_APIKEY']}',
          authDomain: '${process.env['FIREBASE_AUTHDOMAIN']}',
          messagingSenderId: '${process.env['FIREBASE_MESSAGINGSENDERID']}',
      },
      google: {
        apiKey: '${process.env['GOOGLE_APIKEY']}',
        token: '${process.env['GOOGLE_TOKEN']}',
      },
      analytics: '${process.env['ANALYTICS']}',
      vapidKey: '${process.env['VAPIDKEY']}',
      appVersion: packageJson.version,
      production: ${process.env['PRODUCTION']},
      api_url: '${process.env['API_URL']}',
    };
    `;
  console.log(
    'The file `environment.prod.ts` will be written with the following content: \n'
  );
  console.log(envProdConfigFile);

  // Genera archivo con contenido dinámico desde .env.prod
  writeFile(targetProdPath, envProdConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        `Angular environment.prod.ts file generated correctly at ${targetProdPath} \n`
      );
    }
  });

  // `firebase-messaging-sw.js` file structure
  const fbMessagingSWFile = `importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '${process.env['FIREBASE_APIKEY']}',
  authDomain: '${process.env['FIREBASE_AUTHDOMAIN']}',
  databaseURL: '${process.env['FIREBASE_DATABASEURL']}',
  projectId: '${process.env['FIREBASE_PROJECTID']}',
  storageBucket: '${process.env['FIREBASE_STORAGEBUCKET']}',
  messagingSenderId: '${process.env['FIREBASE_MESSAGINGSENDERID']}',
  appId: '${process.env['FIREBASE_APPID']}',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Nuevo mensaje';
  const notificationOptions = {
    body: 'Presiona para revisar en detalle',
    icon: '/assets/icons/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
  `;
  console.log(
    'The file `firebase-messaging-sw.js` will be written with the following content: \n'
  );
  console.log(fbMessagingSWFile);

  // Genera archivo con contenido dinámico desde .env.prod
  writeFile('./src/firebase-messaging-sw.js', fbMessagingSWFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        `Angular firebase-messaging-sw.js file generated correctly at ./src/firebase-messaging-sw.js \n`
      );
    }
  });
};

setEnvProd();
