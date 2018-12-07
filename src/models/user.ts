import { IDocObject } from 'services/firebase/firestore';

export class User {

  id: string;
  uid: string;
  name: string;
  email: string;
  photoUrl: string;

  static fromObject(obj: IDocObject): User {
    return Object.assign(
      new User(),
      {
        id: obj.id,
        uid: obj.uid,
        name: obj.displayName,
        email: obj.email,
        photoUrl: obj.photoURL,
      },
    );
  }
}
