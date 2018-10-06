import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { FirebaseFirestore, CollectionReference, QueryDocumentSnapshot, DocumentData, Query } from '@firebase/firestore-types';
import { FirebaseService } from './firebase';


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

  store: FirebaseFirestore;
  collectionRef: CollectionReference;

  constructor(private firebase: FirebaseService, collectionPath: string) {
    this.logger.debug('Initialize Firestore');
    this.store = firebase.app.firestore();
    this.store.settings({ timestampsInSnapshots: true });
    this.collectionRef = this.store.collection(collectionPath);
  }

  /**
   * Read functions
   */

  public async fetchCollection(): Promise<IDocObject[]> {
    const snapshot = await this.collectionRef.get();
    const arr: IDocObject[] = [];

    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      arr.push(this.toObject(doc.id, doc.data()));
    });
    return arr;
  }

  public async fetchDocument(docId: string): Promise<IDocObject> {
    const snapshot = await this.collectionRef.doc(docId).get();
    if (!snapshot.exists) {
      throw new Error(`No document id: ${docId}`);
    }
    return this.toObject(snapshot.id, snapshot.data() || {});
  }

  public async fetchByQuery(query: Query): Promise<IDocObject[]> {
    const snapshot = await query.get();
    const arr: IDocObject[] = [];

    snapshot.forEach(doc => {
      arr.push(this.toObject(doc.id, doc.data()));
    });
    return arr;
  }

  /**
   * Update functions
   */

  public async add(object: IDocData | IDocObject): Promise<IDocObject> {
  const doc = this.toDoc(Object.assign(object, { createdAt: new Date() }));
  const docRef = await this.collectionRef.add(doc);
  return this.fetchDocument(docRef.id);
  }

  public async delete(docId: string) {
    await this.collectionRef.doc(docId).delete();
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

  private toObject(docId: string, docData: DocumentData): IDocObject {
    const obj = FirestoreService.castTimestampToDate(docData, ['createdAt']);
    return Object.assign({}, { id: docId }, obj);
  }

  private toDoc(object: IDocData | IDocObject): IDocData {
    const doc = Object.assign({}, object);
    delete doc.id;
    return doc;
  }
}
