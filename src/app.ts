import { Router, RouterConfiguration, NavigationInstruction, Next, Redirect } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { AuthService } from 'services/firebase/auth';
import { getLogger } from 'aurelia-logging';
import { autoinject } from 'aurelia-framework';
import { AuthorizeStep } from 'authorize-step';


@autoinject
export class App {

  router: Router;

  constructor(private auth: AuthService) {}

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
        settings: { auth: true, admin: true },
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
