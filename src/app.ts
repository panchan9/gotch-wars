import { Router, RouterConfiguration, NavigationInstruction, Next, Redirect } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { AuthenticationService } from 'services/firebase/authentication';
import { getLogger } from 'aurelia-logging';
import { autoinject } from 'aurelia-framework';


@autoinject
export class App {

  router: Router;

  constructor(private auth: AuthenticationService) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Gotch Wars';

    config.options.pushState = true;
    config.options.root = '/';

    config.addAuthorizeStep(AuthorizeStep);

    config.map([
      {
        route: '',
        name: 'welcome',
        moduleId: PLATFORM.moduleName('welcome.html'),
        title: 'Welcom to Gotch Wars',
      },
      {
        route: 'login',
        name: 'login',
        moduleId: PLATFORM.moduleName('login'),
        title: 'Login',
      },
      {
        route: 'admin',
        name: 'admin',
        moduleId: PLATFORM.moduleName('admin/admin'),
        title: 'Admin Console',
        nav: true,
        settings: { auth: true },
      },
      {
        route: 'record/new',
        name: 'record-keeper',
        moduleId: PLATFORM.moduleName('record-keeper'),
        title: 'Record Keeper',
        nav: true,
        settings: { auth: true },
      },
      {
        route: 'record/history',
        name: 'record-history',
        moduleId: PLATFORM.moduleName('record-history'),
        title: 'Record History',
        nav: true,
      },
    ]);

    this.router = router;
  }
}

@autoinject
class AuthorizeStep {

  private readonly logger = getLogger(AuthorizeStep.name);

  constructor(private auth: AuthenticationService) {}

  run(navInst: NavigationInstruction, next: Next): Promise<any> {
    this.logger.debug('Current User: ', this.auth.auth.currentUser);
    const isAuthRequired = navInst.getAllInstructions()
      .some(i => i.config.settings.auth);

    if (!isAuthRequired) {
      return next();
    }

    if (this.auth.isLoggedIn) {
      return next();
    }

    this.logger.info('Redirect to Login Component');
    return next.cancel(new Redirect('login'));
  }
}
