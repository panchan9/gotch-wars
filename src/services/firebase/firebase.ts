import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import environment from 'environment';

export class FirebaseService {

  app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp(environment.firebase);
  }
}
