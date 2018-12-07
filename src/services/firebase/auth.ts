import { autoinject } from 'aurelia-framework';
import { BindingSignaler } from 'aurelia-templating-resources';
import { getLogger } from 'aurelia-logging';
import * as firebase from 'firebase/app';

@autoinject
export class AuthService {

  private readonly logger = getLogger(AuthService.name);

  isLoggedIn = false;
  isAdmin = false;

  constructor(
    public auth: firebase.auth.Auth,
    private signaler: BindingSignaler,
  ) {
    this.logger.info('Initialize Firebase Authentication');
    // Exisiting and future Auth states are persisted even on
    // other browser tab or window unless the user explicitly sign out.
    // https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=ja
    // this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  async updateUserStatus(user: firebase.User | null) {
    this.isLoggedIn = user ? true : false;

    if (this.isLoggedIn) {
      this.isAdmin = await this.getUser()
        .getIdTokenResult()
        .then(idTokenResult => idTokenResult.claims.admin === true);
    } else {
      this.isAdmin = false;
    }

    this.signaler.signal('auth:state:changed');
  }

  logout() {
    this.auth.signOut().then(() => {
      this.isLoggedIn = false;
    })
    .catch(err => {
      throw new Error(err);
    });
  }

  getUid() {
    if (!this.auth.currentUser) {
      throw new Error('User not logged in');
    }
    return this.auth.currentUser.uid;
  }

  getUser() {
    if (!this.auth.currentUser) {
      throw new Error('User not logged in');
    }
    return this.auth.currentUser;
  }

  getIdToken(): Promise<string> {
    return this.getUser().getIdToken();
  }
}
