import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase';
import { Router } from 'aurelia-router';

@autoinject
export class AuthService {

  private readonly logger = getLogger(AuthService.name);

  auth: firebase.auth.Auth;
  isLoggedIn = false;

  constructor(private fb: FirebaseService, private router: Router) {
    this.auth = this.fb.app.auth();
    // Exisiting and future Auth states are persisted even on
    // other browser tab or window unless the user explicitly sign out.
    // https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=ja
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    this.logger.info('Initialize Authentication');

    this.auth.onAuthStateChanged(user => {
      this.logger.info('Auth Stage Changed', user);
      this.isLoggedIn = user ? true : false;

      if (this.isLoggedIn) {
        // this.router.navigateBack();
        // this.router.navigate('/');
        this.router.navigateToRoute('record-history');
      } else {
        this.logger.info('router', this.router)
        this.router.navigate('/');
      }
    });
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

  async isAdmin() {
    if (!this.auth.currentUser) {
      return false;
    }
    return this.auth.currentUser.getIdTokenResult()
      .then(idTokenResult => idTokenResult.claims.admin === true);
  }
}
