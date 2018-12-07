import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { AuthUIService } from 'services/firebase/auth-ui';
import { AuthService } from 'services/firebase/auth';
import { NavigationInstruction } from 'aurelia-router';

@autoinject
export class SginIn {

  private readonly logger = getLogger(SginIn.name);

  constructor(
    private auth: AuthService,
    private authUI: AuthUIService,
  ) { }

  canActivate(_: any, __: any, navInst: NavigationInstruction) {
    if (this.auth.isLoggedIn) {
      this.logger.info('User is already signed in. Navigate to Welcome page');
      navInst.router.navigateToRoute('welcome');
    }
  }

  attached() {
    this.authUI.render('#firebaseui-auth-container');
  }
}
