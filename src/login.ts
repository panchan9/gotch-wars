import { autoinject, Container } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { AuthService } from 'services/firebase/auth';
import { NavigationInstruction } from 'aurelia-router';
import * as firebaseui from 'firebaseui';
import { AuthenticationUI } from 'services/firebase/auth-ui';

@autoinject
export class Login {

  private readonly logger = getLogger(Login.name);

  private ui: firebaseui.auth.AuthUI;

  constructor(
    private auth: AuthService,
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
