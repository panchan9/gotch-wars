import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Arrival } from 'models/arrival';
import { getLogger } from 'aurelia-logging';
import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { SnackbarService } from 'services/snackbar';
import { User } from 'models/user';
import { FunctionsService } from 'services/firebase/functions';

@autoinject
export class ArrivalWizard {

  private readonly logger = getLogger(ArrivalWizard.name);

  arrival = new Arrival;
  isLoading = false;
  users: User[] = [];
  isNewUser = false;

  constructor(
    private router: Router,
    private store: ArrivalStore,
    private functions: FunctionsService,
    private snackbar: SnackbarService,
  ) {}

  async canActivate() {
    const uniqueUids: string[] = [];
    try {
      const uids = await this.store.fetchAll()
        .then(users => users.map(u => u.uid));

      uniqueUids.push(...new Set(uids));
    } catch (err) {
      this.logger.error('Failed to load Arrivals:', err);
      return false;
    }

    try {
      this.users = await this.functions.fetchUsers(uniqueUids);
    } catch (err) {
      this.logger.error('Failed to load Users', err);
      return false;
    }

    return true;
  }

  async save() {
    this.isLoading = true;
    try {
      await this.store.register(this.arrival);
      this.snackbar.showAndHide({ message: 'Registered!! '});

    } catch (err) {
      this.logger.error('failed to register: ', err);
      this.snackbar.show({
        message: 'Failed to register!!',
        actionText: 'Retry',
        actionHandler: () => { this.save(); },
      });

    } finally {
      this.isLoading = false;
    }
  }
}
