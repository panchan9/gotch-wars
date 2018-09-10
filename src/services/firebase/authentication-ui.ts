import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { AuthenticationService } from './authentication';
import { Router, NavigationInstruction } from 'aurelia-router';

@autoinject
export class AuthenticationUI {

  private readonly logger = getLogger(AuthenticationUI.name);

  private uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return this.router.navigate('/');
      },
      uiShown: () => { this.logger.debug('UI Show')},
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };
  private ui: firebaseui.auth.AuthUI;

  constructor(private auth: AuthenticationService, private router: Router) {
    this.ui = new firebaseui.auth.AuthUI(this.auth.auth);
  }

  canActivate(_: any, __: any, navInst: NavigationInstruction) {
    if (this.auth.isLoggedIn) {
      navInst.router.navigateBack();
    }
  }

  attached() {
    this.logger.debug('activate', this.ui);

    // this.ui = new firebaseui.auth.AuthUI(this.auth.auth);
    this.ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  render(elementId: string) {
    this.ui.start(elementId, this.uiConfig);
  }
}
