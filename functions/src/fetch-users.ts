import * as admin from 'firebase-admin';

export class FetchUsers {

  constructor(private auth: admin.auth.Auth) {}

  async fetch(uids: string[]) {
    const userRecords = await Promise.all(uids.map(uid => this.auth.getUser(uid)));

    return userRecords.map(rec => rec.toJSON());
  }

  async asyncMap(array: any[], func: (any) => any) {
    return Promise.all(array.map(item => func(item)));
  }
}
