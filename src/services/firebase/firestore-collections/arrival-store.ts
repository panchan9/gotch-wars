import { autoinject } from 'aurelia-framework';
import { FirestoreService } from '../firestore';
import { FirebaseService } from '../firebase';
import { AuthService } from '../auth';
import { Arrival } from 'models/arrival';
import { FunctionsService } from '../functions';

@autoinject
export class ArrivalStore {

  dao: FirestoreService;

  constructor(
    private firebase: FirebaseService,
    private auth: AuthService,
    private functions: FunctionsService,
  ) {
    this.dao = new FirestoreService(this.firebase, 'arrival');
  }

  fetchAll(): Promise<Arrival[]> {
    return this.dao.fetchCollection()
      .then(dto => dto.map(Arrival.fromObject));
  }

  fetchByUid(uid: string):Promise<Arrival[]> {
    const query = this.dao.collectionRef.where('uid', '==', uid);
    return this.dao.fetchByQuery(query)
      .then(dto => dto.map(Arrival.fromObject));
  }

  register(arrival: Arrival): Promise<Arrival> {
    if (!arrival.uid) {
      arrival.uid = this.auth.getUid();
    }
    return this.functions.registerArrival(arrival.toObject());
  }
}
