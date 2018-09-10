import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Arrival } from 'models/arrival';
import { getLogger } from 'aurelia-logging';
import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { SnackbarService } from 'services/snackbar';

@autoinject
export class ArrivalWizard {

  private readonly logger = getLogger(ArrivalWizard.name);

  arrival = new Arrival;

  constructor(
    private router: Router,
    private store: ArrivalStore,
    private snackbar: SnackbarService,
  ) {}

  async save() {
    this.logger.info('Save', this.arrival);
    try {
      await this.store.register(this.arrival);
      this.logger.debug('registered');
      this.snackbar.showAndHide({ message: 'Registered!! '});

    } catch (err) {
      this.logger.error('failed to register: ', err);
      this.snackbar.show({
        message: 'Failed to register!!',
        actionText: 'Retry',
        actionHandler: () => { this.save(); },
      });
      return;
    }
  }
}
