import { MdcSnackbar, IMdcSnackbarOptions } from 'aurelia-mdc-bridge';

export class SnackbarService {

  show(options: IMdcSnackbarOptions) {
    this.showSnackbar(options);
  }

  showAndHide(options: IMdcSnackbarOptions) {
    const opts = Object.assign(
      { actionText: 'Hide' },
      options,
    );
    this.showSnackbar(opts);
  }

  private showSnackbar(options: IMdcSnackbarOptions) {
    const bar = new MdcSnackbar();
    bar.show(options);
  }
}
