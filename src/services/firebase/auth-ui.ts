import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

@autoinject
export class AuthUIService {

  private readonly logger = getLogger(AuthUIService.name);

  // https://github.com/firebase/firebaseui-web
  private uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return false;   // don't redirect
      },
      uiShown: () => { this.logger.debug('UI Show')},
    },
    signInFlow: 'redirect',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };

  constructor(private ui: firebaseui.auth.AuthUI) {}

  render(elementId: string) {
    this.ui.start(elementId, this.uiConfig);
  }
}
