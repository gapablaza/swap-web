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
    const envProdConfigFile = `export const environment = {
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
  };
  
  setEnvProd();
  