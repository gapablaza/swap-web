'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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
