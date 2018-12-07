import { Firestore, DocumentData, QuerySnapshot } from '@google-cloud/firestore';
import { getDate, addDays } from 'date-fns';

enum CollectionTypes {
  Arrival = 'arrival',
}

export class FirestoreService {

  constructor(private store: Firestore) {
    store.settings({
      timestampsInSnapshots: true,
    })
  }

  async addArrival(arrival: any) {
    arrival.arrivedAt = new Date(arrival.arrivedAt);

    return this.addNewDoc(CollectionTypes.Arrival, arrival)
      .then(docRef => {
        console.info(`New Arrival Registered with ID: ${docRef.id}`);
        return Object.assign(docRef.get(), { id: docRef.id});
      })
      .catch(err => {
        console.error('Failed to register Arrival:', arrival);
        throw err;
      });
  }

  private getByUid(uid: string, date: Date): Promise<Object[]> {
    const query = this.store.collection(CollectionTypes.Arrival)
      .where('uid', '==', uid);

    if (date) {
      const nextDate = addDays(date, 1);
      console.log('arrivalAt', date, nextDate);
      query.where('arrivedAt', '>=', date)
        .where('arrivedAt', '<', nextDate);
    }

    return query.get()
      .then(snapshot => {
        if (snapshot.empty) {
          return [];
        }
        return snapshot.docs
          .map(d => Object.assign({}, { id: d.id, }, d.data()));
      });
  }

  private addNewDoc(collection: CollectionTypes, doc: DocumentData) {
    return this.store.collection(collection)
      .add(Object.assign({ createdAt: new Date() }, doc));
  }

}
