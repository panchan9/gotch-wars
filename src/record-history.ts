import { ArrivalStore } from 'services/firebase/firestore-collections/arrival-store';
import { autoinject } from 'aurelia-framework';
import { Arrival } from 'models/arrival';

@autoinject
export class RecordHistory {

  arrivals: Arrival[] = [];

  constructor(private store: ArrivalStore) {}

  async activate() {
    this.arrivals = await this.store.fetchAll();
  }
}
