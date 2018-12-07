import { AuthService } from 'services/firebase/auth';
import { autoinject } from 'aurelia-framework';
import { NavigationInstruction, Next, Redirect } from 'aurelia-router';
import { getLogger } from 'aurelia-logging';

@autoinject
export class AuthorizeStep {

  private readonly logger = getLogger(AuthorizeStep.name);

  constructor(private auth: AuthService) {}

  async run(instruction: NavigationInstruction, next: Next): Promise<void> {
    this.logger.debug('Current User:', this.auth.auth.currentUser);

    const isAuthRequired = instruction.getAllInstructions()
      .some(i => i.config.settings.auth);

    const isAdminRequired = instruction.getAllInstructions()
      .some(i => i.config.settings.admin);

    if (isAdminRequired && !this.auth.isAdmin) {
      this.logger.warn('Non-admin user tried to access to admin page');
      // TODO: redirect 403 error page
      return next.cancel(new Redirect('sign-in'));
    }
    if (isAuthRequired && !this.auth.isLoggedIn) {
      return next.cancel(new Redirect('sign-in'));
    }

    return next();
  }

}
