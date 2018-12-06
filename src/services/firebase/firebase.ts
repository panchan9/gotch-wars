import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
// import environment from 'environment';
import { getLogger } from 'aurelia-logging';

export class FirebaseService {

  private readonly logger = getLogger(FirebaseService.name);

  constructor(public app: firebase.app.App) {
    this.logger.info('Initialize Firebase App');
    // this.app = firebase.initializeApp(environment.firebase);
  }
}
