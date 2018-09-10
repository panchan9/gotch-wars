import { autoinject } from 'aurelia-framework';
import { FirestoreService } from '../firestore';
import { FirebaseService } from '../firebase';
import { AuthenticationService } from '../authentication';
import { Arrival } from 'models/arrival';

@autoinject
export class ArrivalStore {

  dao: FirestoreService;

  constructor(private firebase: FirebaseService, private auth: AuthenticationService) {
    this.dao = new FirestoreService(firebase, 'arrival');
  }

  fetchAll(): Promise<Arrival[]> {
    return this.dao.fetchCollection()
      .then(dto => dto.map(Arrival.fromObject));
  }

  register(arrival: Arrival): Promise<Arrival> {
    if (!arrival.userId) {
      arrival.userId = this.auth.getUserId();
    }
    return this.dao.add(arrival.toObject())
      .then(obj => Arrival.fromObject(obj));
  }
}
