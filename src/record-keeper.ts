import { MdcDialog, IMdcDialogClickEvent } from 'aurelia-mdc-bridge';
import { getLogger } from 'aurelia-logging';
import { Router } from 'aurelia-router';
import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { autoinject } from 'aurelia-framework';
import { SnackbarService } from 'services/snackbar';
import { Arrival } from 'models/arrival';

@autoinject
export class RecordKeeper {

  private readonly logger = getLogger(RecordKeeper.name);
  private dialog: MdcDialog;

  constructor(
    private router: Router,
    private store: ArrivalStore,
    private snackbar: SnackbarService,
  ) {}

  activate() {

  }

  showDialog() {
    this.dialog.show(true);
  }

  async onDialogClick(event: IMdcDialogClickEvent) {
    // do nothing if clicked 'cancel'
    this.logger.debug('dialog', event);
    if (!event.detail) return;

    await this.registerTime();
  }

  async registerTime() {
    this.logger.debug('registerTime', event);
    try {
      const arrival = await this.store.register(new Arrival());
      this.logger.debug('registered', arrival);
      this.snackbar.showAndHide({ message: 'Registered!!' });

    } catch (err) {
      this.logger.error('failed to register: ', err);
      this.snackbar.show({
        message: 'Failed to register!!',
        actionText: 'Retry',
        actionHandler: () => { this.showDialog(); },
      });
      return;
    }
  }

}
