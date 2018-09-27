import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// tslint:disable-next-line:no-duplicate-imports
import { Request, Response } from 'firebase-functions';
import { FetchUsers } from './fetch-users';
import { SlackService } from './services/slack';
import { HttpsError } from 'firebase-functions/lib/providers/https';

import * as express from 'express';
const app = express();
const whitelist = [
  'http://localhost:9000',
  'https://gotch-wars.firebaseapp.com',
];

import * as cors from 'cors';
// https://github.com/expressjs/cors
app.use(cors({
  origin: whitelist,
}));

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript


// Initialize firebase app
// https://firebase.google.com/docs/admin/setup#initialize_the_sdk
const config = functions.config();
admin.initializeApp({
  credential: admin.credential.cert(config.credentials.firebase.serviceaccount),
  databaseURL: 'https://gotch-wars.firebaseio.com',
});

const tokyo = 'asia-northeast1';

export const notifySlack = functions
  // https://firebase.google.com/docs/functions/locations?hl=ja#best_practices_for_changing_region
  .region(tokyo)
  .https.onRequest(async (request, response) => {
    const slack = new SlackService();
    const username = 'パンディー';
    try {
      await slack.post(username);
    } catch (err) {
      console.error('Failed to send notification to Slack', err);
      response.status(500).send('Failed');
    }
    response.send("Hello from Firebase!");
  });

export const fetchUsers = functions
  .region(tokyo)
  .https.onCall(async (data, context) => {
// export const fetchUsers = functions.https.onRequest(async (req: Request, resp: Response) => {
    // https://firebase.google.com/docs/functions/callable?hl=ja#handle_errors
    if (!context.auth) {
      throw new HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    }
    // const uid = context.auth.uid;

    const fetchUsers = new FetchUsers(admin.auth());
    try {
      const users = await fetchUsers.fetch(data.uids)
      return users;
      // resp.status(200).send(users);
    } catch (err) {
      console.error('Failed to fetch user data.', err);
      throw new HttpsError('invalid-argument', err);
      // resp.status(404).send('Not Found');
    }
  });

export const grantAdminPrivilege = functions
  .region(tokyo)
  .https.onRequest(async (req, resp) => {
    const uid = req.body.uid;
    const claims = req.body.claims;
    console.info({uid, claims});

    admin.auth().setCustomUserClaims(uid, claims)
      .then(() => {
        console.info('Setting Claims has been successful');
        resp.end(JSON.stringify({ status: 'success' }));
      })
      .catch(err => {
        console.error('Failed to set Claims', err);
        resp.status(500).send({ status: 'ineligible' });
      });
  })
