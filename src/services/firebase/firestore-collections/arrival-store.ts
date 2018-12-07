import { autoinject } from 'aurelia-framework';
import { FirestoreService } from '../firestore';
import { AuthService } from '../auth';
import { Arrival } from 'models/arrival';
import { FunctionsService } from '../functions';
import { startOfMonth, addMonths, endOfMonth } from 'date-fns';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
// import { firestore } from 'firebase';
import { getLogger } from 'aurelia-logging';

@autoinject
export class ArrivalStore {

  private readonly logger = getLogger(ArrivalStore.name);
  private readonly domain = 'arrival';
  private ref: firebase.firestore.CollectionReference;

  constructor(
    private store: FirestoreService,
    private auth: AuthService,
    private functions: FunctionsService,
  ) {
    this.ref = this.store.getCollectionReference(this.domain);
  }

  fetchAll(): Promise<Arrival[]> {
    return this.store.fetchCollection(this.ref)
      .then(dto => dto.map(Arrival.fromObject));
  }

  fetchByPastMonth(offset: number): Promise<Arrival[]> {
    const d = addMonths(new Date(), -offset);
    const start = startOfMonth(d);
    const end = endOfMonth(d);

    const query = this.ref
      .where('arrivedAt', '>=', firebase.firestore.Timestamp.fromDate(start))
      .where('arrivedAt', '<=', firebase.firestore.Timestamp.fromDate(end));

    return this.store.fetchByQuery(query)
      .then(dto => dto.map(Arrival.fromObject));
  }

  fetchByUid(uid: string):Promise<Arrival[]> {
    const query = this.ref.where('uid', '==', uid);
    return this.store.fetchByQuery(query)
      .then(dto => dto.map(Arrival.fromObject));
  }

  register(arrival: Arrival): Promise<Arrival> {
    if (!arrival.uid) {
      arrival.uid = this.auth.getUid();
    }
    return this.functions.registerArrival(arrival.toObject());
  }
}
