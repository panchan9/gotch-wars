import { AuthService } from 'services/firebase/auth';
import { autoinject } from 'aurelia-framework';
import { NavModel } from 'aurelia-router';

@autoinject
export class AuthRouteFilterValueConverter {

  constructor(private auth: AuthService) {}

  toView(routes: NavModel[]) {
    const isAuthenticated = this.auth.isLoggedIn;
    const isAdmin = this.auth.isAdmin;
    console.debug('AuthRouteFilter is called');

    return routes.filter(r => r.settings.auth === undefined
      || isAdmin
      || (!r.settings.admin && isAuthenticated));
  }
}

