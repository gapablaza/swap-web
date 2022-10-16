'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DataSnapshot } = require('firebase-functions/v1/database');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.

// Max older conversations. Child nodes older than this will be deleted.
const MAX_OLDER_CONVERSATIONS_TIME = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds.
const MAX_DELETED_CONVERSATIONS = 500;

// Función para actualizar los userResume cuando se elimina un mensaje sin leer
exports.updateUnreadStatus = functions.database
  .ref('/unreadUserMessages/{userId}/{otherUserId}')
  .onDelete(async (change, context) => {
    const userId = context.params.userId;
    const otherUserId = context.params.otherUserId;

    functions.logger.log(
      'Hay un nuevo mensaje de ',
      otherUserId,
      ' para el usuario ',
      userId
    );

    let updates = {};
    const userResumeRef = admin.database().ref('/userResume');

    const userRes = await userResumeRef
      .child(userId + '/' + otherUserId)
      .once('value');

    const otherRes = await userResumeRef
      .child(otherUserId + '/' + userId)
      .once('value');

    if (userRes.exists() && otherRes.exists()) {
      updates[userId + '/' + otherUserId + '/unread'] = false;
      updates[otherUserId + '/' + userId + '/unread'] = false;

      return userResumeRef.update(updates);
    } else {
      return functions.logger.log('No existen los nodos de los usuarios');
    }
  });

// Función que elimina conversaciones con una antigüedad mayor a la configurada (1 año)
exports.deleteOldConversations = functions.https.onRequest(
  async (request, response) => {
    const now = Date.now();
    const cutoff = now - MAX_OLDER_CONVERSATIONS_TIME;

    let counter = 0;
    let deletes = {};
    let promises = [];

    const mainRef = admin.database().ref();
    const userResumeRef = admin.database().ref('/userResume');

    // const queryUserResume = userResumeRef.limitToFirst(1000);
    // const snapshotUserResumen = await queryUserResume.once('value');
    const snapshotUserResumen = await userResumeRef.once('value');

    snapshotUserResumen.forEach((mainNode) => {
      if (counter == MAX_DELETED_CONVERSATIONS) {
        return;
      }

      // 1.- Obtener el nodo de resumen por usuario /userResume
      let mainUserKey = mainNode.key;
      // functions.logger.info('mainUserKey:', mainUserKey);

      // 2.- Recorrerlo y por cada usuario guardar su ID (mainUserId) para iterar sus conversaciones
      mainNode.forEach((childNode) => {
        if (counter == MAX_DELETED_CONVERSATIONS) {
          return;
        }

        let childUserKey = childNode.key;
        // functions.logger.info('childUserKey:', childUserKey);
        let tempMessage = childNode.val();
        // 3.- Si la conversación tiene mas de 1 año de antigüedad se guarda el ID del childUserId
        if (tempMessage.timestamp < cutoff) {
          if (!mainUserKey || !childUserKey) {
            return;
          }

          //     y se eliminan los nodos asociados:
          //      /userResume/mainUserId/childUserId
          //      /userResume/childUserId/mainUserId
          //      /unreadUserMessages/mainUserId/childUserId
          //      /unreadUserMessages/childUserId/mainUserId
          //      /userMessages/userId/userId
          deletes['userResume/' + mainUserKey + '/' + childUserKey] = null;
          deletes['userResume/' + childUserKey + '/' + mainUserKey] = null;
          deletes['unreadUserMessages/' + mainUserKey + '/' + childUserKey] =
            null;
          deletes['unreadUserMessages/' + childUserKey + '/' + mainUserKey] =
            null;
          if (mainUserKey < childUserKey) {
            deletes['userMessages/' + mainUserKey + '/' + childUserKey] = null;
          } else {
            deletes['userMessages/' + childUserKey + '/' + mainUserKey] = null;
          }

          promises.push(mainRef.update(deletes));
          counter++;
          functions.logger.info(
            'counter:',
            counter,
            'node: ' + mainUserKey + '/' + childUserKey
          );
          deletes = {};
        }
      });
    });

    Promise.all(promises).then(() => {
      functions.logger.info('finish ', promises.length, ' nodes');
    });

    response.sendStatus(200);
  }
);

// Función para eliminar nodes que no tengan la estructura correcta
exports.deleteOldNodes = functions.https.onRequest(
  async (request, response) => {
    const feedRef = admin.database().ref('/userResume');

    const now = Date.now();
    const cutoff = now - CUT_OFF_TIME;
    const query = feedRef
      // .orderByChild('timestamp')
      // .endAt(cutoff)
      .limitToFirst(200);

    const snapshot = await query.once('value');
    // create a map with all children that need to be removed
    const updates = {};
    let nodes = [];
    snapshot.forEach((child) => {
      if (!child.key.startsWith('userId_')) {
        updates[child.key] = null;
        nodes.push(child.key);
      }
    });

    // execute all updates in one go and return the result to end the function
    // return feedRef.update(updates);
    functions.logger.info('nodes:', nodes);
    response.send(feedRef.update(updates));
    // response.send(nodes);
  }
);

// Función para eliminar registros antiguos del /feedsHome
exports.cleanFeed = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .https.onRequest(async (request, response) => {
    const feedRef = admin.database().ref('/feedsHome');

    const now = Date.now();
    const cutoff = now - CUT_OFF_TIME;
    const oldItemsQuery = feedRef
      .orderByChild('timestamp')
      .endAt(cutoff)
      .limitToFirst(500);

    const snapshot = await oldItemsQuery.once('value');
    // create a map with all children that need to be removed
    const updates = {};
    snapshot.forEach((child) => {
      updates[child.key] = null;
    });

    // execute all updates in one go and return the result to end the function
    // return feedRef.update(updates);
    functions.logger.info('updates count:', snapshot.numChildren());
    response.send(feedRef.update(updates));
  });
