import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { autoinject } from 'aurelia-framework';
import { Arrival } from 'models/arrival';
import { getLogger } from 'aurelia-logging';
import { UserHistory } from 'models/user-history';
import { GotchResult } from 'models/gotch-result';
import { FunctionsService } from 'services/firebase/functions';

@autoinject
export class RecordHistory {

  private readonly logger = getLogger(RecordHistory.name);

  arrivals: Arrival[] = [];
  gotch: GotchResult;
  isLoading = false;

  constructor(
    private store: ArrivalStore,
    private api: FunctionsService,
  ) {}

  activate() {
    this.isLoading = true;
  }

  async attached() {
    // this.arrivals = await this.store.fetchAll();
    this.arrivals = await this.store.fetchByPastMonth(0);

    // make unique UID list
    const uids = Array.from(new Set(this.arrivals.map(a => a.uid)));

    this.logger.debug('uids', uids)
    const users = await this.api.fetchUsers(uids)
      .catch(err => {
        this.logger.error('Failed to load user info', err);
        throw err;
      });

    this.logger.info('Loaded user info', users);

    // Create GotchResult instances
    const userHistories = users.map(user => {
      const arrivals = this.arrivals.filter(a => a.uid === user.uid);
      return UserHistory.fromArrivals(arrivals, user);
    });

    this.gotch = GotchResult.fromArrivals(userHistories);
    this.logger.debug('GotchResult', this.gotch);

    this.isLoading = false;
  }
}
