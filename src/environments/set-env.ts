const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  // Load node modules
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
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
    production: ${process.env['PRODUCTION']},
    api_url: '${process.env['API_URL']}',
  };
  `;
  console.log(
    'The file `environment.ts` will be written with the following content: \n'
  );
  console.log(envConfigFile);
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      );
    }
  });
};

setEnv();
