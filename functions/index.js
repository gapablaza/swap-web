'use strict';

const { onRequest } = require('firebase-functions/v2/https');
const {
  onValueDeleted,
  onValueWritten,
} = require('firebase-functions/v2/database');
const { setGlobalOptions } = require('firebase-functions/v2');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

const { initializeApp } = require('firebase-admin/app');
initializeApp(); // admin.initializeApp();

// locate all functions closest to users
setGlobalOptions({ region: 'us-central1', maxInstances: 10 });
const db = admin.database();

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.
const ONLINE_USERS_CUT_OFF_TIME = 2 * 24 * 60 * 60 * 1000; // 2 Days in milliseconds.

// Max older conversations. Child nodes older than this will be deleted.
const MAX_OLDER_CONVERSATIONS_TIME = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds.
const MAX_DELETED_CONVERSATIONS = 500;


// 2nd Gen
// Función para notificar nuevos mensajes al destinatario
exports.notifyNewMessage2ndGen = onValueWritten(
  '/unreadUserMessages/{userId}/{otherUserId}',
  async (event) => {
    const userId = event.params.userId.substring(7);
    const otherUserId = event.params.otherUserId.substring(7);

    // Exit when the data is deleted.
    if (!event.data.after.exists()) {
      return null;
    }

    // Se verifica que el "user" no tenga en su blacklist al "otherUser"
    const blacklistSnapshot = await db
      .ref(`/userBlacklist/userId_${userId}/userId_${otherUserId}`)
      .once('value');

    if (blacklistSnapshot.exists() && blacklistSnapshot.val() == true) {
      return logger.info(
        `[2G] userId_${userId} tiene en su blacklist al userId_${otherUserId}`
      );
    }

    logger.info(
      '[2G] El usuario ID',
      userId,
      ' tiene un nuevo mensaje del usuario ID ',
      otherUserId
    );

    // Get the list of device notification tokens.
    const getDeviceTokensPromise = db
      .ref(`/users/userId_${userId}/notificationTokens`)
      .once('value');

    const results = await Promise.all([getDeviceTokensPromise]);
    const tokensSnapshot = results[0];

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      return logger.log(
        '[2G] There are no notification tokens to send to.'
      );
    }

    logger.log(
      '[2G] There are',
      tokensSnapshot.numChildren(),
      'tokens to send notifications to.'
    );

    const notificationData = {
      title: `${event.data.after.val().fromUserName} dice:`,
      body: `${event.data.after.val().body}`,
      // icon: `${event.data.after.val().fromUserImage}`,
      // color: '#46be9c',
      // click_action: `https://intercambialaminas.com/message/${otherUserId}`,
    };

    // Listing all tokens as an array.
    const tokens = Object.keys(tokensSnapshot.val());

    // Send message to all tokens
    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,
      notification: notificationData,
      // data: {
      //     ownerId: ownerId,
      //     userId: userId,
      //     notificationOption: "receivedFriendRequest",
      // },
    });

    // For each message check if there was an error.
    const tokensToRemove = [];
    response.responses.forEach((result, index) => {
        const error = result.error;
        if (error) {
            logger.error(
                'Failure sending notification to',
                tokens[index],
                error.code,
                // error.message
            );
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/unregistered' || 
                error.code === 'messaging/invalid-argument') {               
                tokensToRemove.push(
                  tokensSnapshot.ref.child(tokens[index]).remove()
                );
            }
        }
    });
    return Promise.all(tokensToRemove);
  }
);


// 2nd Gen
// Función para actualizar los userResume cuando se elimina un mensaje sin leer
exports.updateUnreadStatus2ndGen = onValueDeleted(
  '/unreadUserMessages/{userId}/{otherUserId}',
  async (event) => {
    const userId = event.params.userId;
    const otherUserId = event.params.otherUserId;

    logger.info('[2G] UpdateUnreadStatus: De ', otherUserId, ' para ', userId);

    let updates = {};
    const userResumeRef = db.ref('/userResume');
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
      return logger.info('No existen los nodos de los usuarios');
    }
  }
);


// 2nd Gen
// Función que elimina conversaciones con una antigüedad mayor a la configurada (1 año)
exports.deleteOldConversations2ndGen = onRequest(
  { cors: true, timeoutSeconds: 300 },
  async (req, res) => {
    const now = Date.now();
    const cutoff = now - MAX_OLDER_CONVERSATIONS_TIME;

    let counter = 0;
    let deletes = {};
    let promises = [];

    const mainRef = db.ref();
    const userResumeRef = db.ref('/userResume');

    const snapshotUserResumen = await userResumeRef.once('value');
    logger.info('number of nodes: ', snapshotUserResumen.numChildren());

    snapshotUserResumen.forEach((mainNode) => {
      if (counter == MAX_DELETED_CONVERSATIONS) {
        return;
      }

      // 1.- Obtener el nodo de resumen por usuario /userResume
      let mainUserKey = mainNode.key;

      // 2.- Recorrerlo y por cada usuario guardar su ID (mainUserId) para iterar sus conversaciones
      mainNode.forEach((childNode) => {
        if (counter == MAX_DELETED_CONVERSATIONS) {
          return;
        }

        let childUserKey = childNode.key;
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

          logger.info(
            'counter: ',
            counter,
            'node: ' + mainUserKey + '/' + childUserKey
          );
          deletes = {};
        }
      });
    });

    await Promise.all(promises)
      .then(() => {
        logger.info('finish ', promises.length, ' nodes');
      })
      .catch((error) => {
        return res.status(400).json({
          status: 'error',
          message: error.message,
        });
      });

    return res.status(200).json({
      status: 'success',
      message: 'Delete Old Conversations Successful',
      data: promises.length,
    });
  }
);


// 2nd Gen
// Función para eliminar registros antiguos del /feedsHome
exports.cleanFeed2ndGen = onRequest(
  { cors: true, timeoutSeconds: 300 },
  async (req, res) => {
    const feedRef = db.ref('/feedsHome');
    const now = Date.now();
    const cutoff = now - CUT_OFF_TIME;
    const oldItemsQuery = feedRef
      .orderByChild('timestamp')
      .endAt(cutoff)
      .limitToFirst(500);

    const snapshot = await oldItemsQuery.once('value');
    logger.info('number of nodes: ', snapshot.numChildren());

    // create a map with all children that need to be removed
    const updates = {};
    snapshot.forEach((child) => {
      updates[child.key] = null;
    });
    logger.info('Updates count: ', Object.keys(updates).length);

    // execute all updates in one go and return the result to end the function
    // response.send(feedRef.update(updates));
    await feedRef.update(updates).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Clean Feed Successful',
      data: Object.keys(updates).length,
    });
  }
);


// 2nd Gen
// Función para eliminar registros antiguos del /onlineUsers
exports.cleanOnlineUsers2ndGen = onRequest(
  { cors: true, timeoutSeconds: 300 },
  async (req, res) => {
    const onlineUsersRef = db.ref('/onlineUsers');
    const now = Date.now();
    const cutoff = now - ONLINE_USERS_CUT_OFF_TIME;
    const onlineUsersQuery = onlineUsersRef
      .orderByChild('lastUpdated')
      .endAt(cutoff)
      .limitToFirst(500);

    const snapshot = await onlineUsersQuery.once('value');
    logger.info('number of nodes: ', snapshot.numChildren());

    // create a map with all children that need to be removed
    const updates = {};
    snapshot.forEach((child) => {
      let tempNode = child.val();
      if (tempNode.status === 'online') {
        updates[child.key] = null;
      }
    });
    logger.info('Updates count: ', Object.keys(updates).length);

    // execute all updates in one go and return the result to end the function
    await onlineUsersRef.update(updates).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Clean Online Users Successful',
      data: Object.keys(updates).length,
    });
  }
);


// 2nd Gen
// Función para insertar un nuevo registro en el Home's Feed /feedsHome
exports.addFeed = onRequest(
  { cors: true, timeoutSeconds: 300 },
  async (req, res) => {
    const feedsHomeRef = db.ref('/feedsHome');
    const feedData = req.body;
    logger.info('data: ', JSON.stringify(feedData));

    if (req.method !== 'POST') {
      res.status(400).json('Bad request!');
      return;
    }

    try {
      await feedsHomeRef.push(feedData);

      res.status(200).json({
        status: 'success',
        message: 'Home Feed Added Successful',
      });
    } catch (error) {
      res.status(500).json('We found an error posting your request!');
    }
  }
);
