import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
// import { FirebaseFirestore, CollectionReference, QueryDocumentSnapshot, DocumentData, Query, FieldValue } from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
// import { FirebaseFirestore, CollectionReference, QueryDocumentSnapshot, DocumentData, Query, FieldValue } from 'firebase/firestore';


export interface IDocObject {
  id: string,
  [extra: string]: any,
}

export interface IDocData {
  [extra: string]: any,
}

/**
 * @see https://github.com/Kesin11/Firestore-simple/blob/master/src/index.ts
 */
@autoinject
export class FirestoreService {

  private readonly logger = getLogger(FirestoreService.name);

  // store: firebase.firestore.Firestore;
  // collectionRef: firebase.firestore.CollectionReference;

  // constructor(public store: firebase.firestore.Firestore, collectionPath: string) {
  constructor(private store: firebase.firestore.Firestore) {
    this.logger.debug('Initialize Firestore');
    // this.store = firebase.app.firestore();
    this.store.settings({ timestampsInSnapshots: true });
    // this.collectionRef = this.store.collection(collectionPath);
  }

  getCollectionReference(domain: string): firebase.firestore.CollectionReference {
    return this.store.collection(domain);
  }

  /**
   * Read functions
   */

  async fetchCollection(ref: firebase.firestore.CollectionReference): Promise<IDocObject[]> {
    const snapshot = await ref.get();
    const arr: IDocObject[] = [];

    snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
      arr.push(this.toObject(doc.id, doc.data()));
    });
    return arr;
  }

  async fetchDocument(ref: firebase.firestore.CollectionReference, docId: string): Promise<IDocObject> {
    const snapshot = await ref.doc(docId).get();
    if (!snapshot.exists) {
      throw new Error(`No document id: ${docId}`);
    }
    return this.toObject(snapshot.id, snapshot.data() || {});
  }

  async fetchByQuery(query: firebase.firestore.Query): Promise<IDocObject[]> {
    const snapshot = await query.get();
    const arr: IDocObject[] = [];

    this.logger.debug('fetchByQuery', query);

    snapshot.forEach(doc => {
      arr.push(this.toObject(doc.id, doc.data()));
    });
    return arr;
  }

  /**
   * Update functions
   */

  async add(ref: firebase.firestore.CollectionReference, object: IDocData | IDocObject): Promise<IDocObject> {
    const doc = this.toDoc(Object.assign(object, { createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
    const docRef = await ref.add(doc);
    return this.fetchDocument(ref, docRef.id);
  }

  async delete(ref: firebase.firestore.CollectionReference, docId: string) {
    await ref.doc(docId).delete();
    return docId;
  }

  static castTimestampToDate(docObj: IDocData, keys: string[]) {
    const obj = Object.assign({}, docObj);
    keys.forEach(key => {
      obj[key] = docObj[key].toDate();
    });
    return obj;
  }

  /**
   * Helper functions
   */

  private toObject(docId: string, docData: firebase.firestore.DocumentData): IDocObject {
    const obj = FirestoreService.castTimestampToDate(docData, ['createdAt']);
    return Object.assign({}, { id: docId }, obj);
  }

  private toDoc(object: IDocData | IDocObject): IDocData {
    const doc = Object.assign({}, object);
    delete doc.id;
    return doc;
  }
}
