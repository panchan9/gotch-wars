import { autoinject, Container } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { AuthenticationService } from 'services/firebase/authentication';
import { Router, NavigationInstruction } from 'aurelia-router';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { AuthenticationUI } from 'services/firebase/authentication-ui';

@autoinject
export class Login {

  private readonly logger = getLogger(Login.name);

  // private uiConfig: firebaseui.auth.Config = {
  //   callbacks: {
  //     signInSuccessWithAuthResult: () => {
  //       return this.router.navigate('/');
  //     },
  //     uiShown: () => { this.logger.debug('UI Show')},
  //   },
  //   signInFlow: 'popup',
  //   signInSuccessUrl: '/',
  //   signInOptions: [
  //     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //   ],
  // };

  private ui: firebaseui.auth.AuthUI;

  constructor(
    private auth: AuthenticationService,
    private authUi: AuthenticationUI,
  ) { }

  canActivate(_: any, __: any, navInst: NavigationInstruction) {
    if (this.auth.isLoggedIn) {
      navInst.router.navigateBack();
    }
  }

  attached() {
    this.logger.debug('activate', this.ui);
    this.authUi.render('#firebaseui-auth-container');
  }
}
