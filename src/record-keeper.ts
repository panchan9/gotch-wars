import { MdcDialog, IMdcDialogClickEvent } from 'aurelia-mdc-bridge';
import { getLogger } from 'aurelia-logging';
import { Router } from 'aurelia-router';
import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { autoinject } from 'aurelia-framework';
import { SnackbarService } from 'services/snackbar';
import { Arrival } from 'models/arrival';
import { AuthService } from 'services/firebase/auth';
import { isToday } from 'date-fns';

@autoinject
export class RecordKeeper {

  private readonly logger = getLogger(RecordKeeper.name);
  dialog: MdcDialog;
  isLoading = false;
  hasAlreadyRegistered = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private store: ArrivalStore,
    private snackbar: SnackbarService,
  ) {}

  async activate() {
    const records =  await this.store.fetchByUid(this.auth.getUid())
      .catch(err => {
        this.logger.error('Failed to load all record of the user', err);
        return Promise.reject(err);
      });

    // cancel the navigation if today's record has been already registered.
    this.hasAlreadyRegistered = records.some(r => isToday(r.arrivedAt));
  }

  showDialog() {
    if (this.hasAlreadyRegistered) {
      this.snackbar.showAndHide({
        message: `You've already registered today's record`
      });
      return;
    }
    this.isLoading = true;
    this.dialog.show(true);
  }

  async onDialogClick(event: IMdcDialogClickEvent) {
    // do nothing if clicked 'cancel'
    this.logger.debug('dialog', event);
    if (!event.detail) {
      this.isLoading = false;
      return;
    }

    await this.registerTime();
  }

  async registerTime() {
    this.logger.debug('registerTime', event);
    try {
      const arrival = await this.store.register(new Arrival());
      this.logger.debug('registered', arrival);

      this.snackbar.showAndHide({ message: 'Registered!!' });
      this.router.navigateToRoute('record-history');

    } catch (err) {
      this.logger.error('failed to register: ', err);
      this.snackbar.show({
        message: 'Failed to register!!',
        actionText: 'Retry',
        actionHandler: () => { this.showDialog(); },
      });

    } finally {
      this.isLoading = false;
    }
  }

}
