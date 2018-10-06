import { autoinject } from 'aurelia-framework';
import { FirestoreService } from '../firestore';
import { FirebaseService } from '../firebase';
import { AuthService } from '../auth';
import { Arrival } from 'models/arrival';

@autoinject
export class ArrivalStore {

  dao: FirestoreService;

  constructor(private firebase: FirebaseService, private auth: AuthService) {
    this.dao = new FirestoreService(this.firebase, 'arrival');
  }

  fetchAll(): Promise<Arrival[]> {
    return this.dao.fetchCollection()
      .then(dto => dto.map(Arrival.fromObject));
  }

  register(arrival: Arrival): Promise<Arrival> {
    if (!arrival.uid) {
      arrival.uid = this.auth.getUid();
    }
    return this.dao.add(arrival.toObject())
      .then(obj => Arrival.fromObject(obj));
  }
}
