import { autoinject } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { FirebaseService } from './firebase';
import { functions } from 'firebase';
import { User } from 'models/user';
// import 'firebase/functions';

@autoinject
export class FunctionsService {

  private readonly logger = getLogger(FunctionsService.name);
  private readonly region = 'asia-northeast1';

  private functions: firebase.functions.Functions;

  constructor(private fb: FirebaseService) {
    // https://firebase.google.com/docs/functions/locations?hl=ja#http_and_client_callable_functions
    this.functions = this.fb.app.functions(this.region);
  }

  async fetchUsers(uids: string[]): Promise<User[]> {
    this.logger.debug('uids', uids);
    const callable = this.functions.httpsCallable('fetchUsers');

    return callable({ uids })
      .then(result => result.data)
      .then((users: Object[]) => users.map(User.fromObject))
      // https://firebase.google.com/docs/functions/callable?hl=ja#handle_errors_on_the_client
      .catch((err: functions.HttpsError) => {
        this.logger.error(err.code, err.message);
        throw err;
      });
  }

  async registerArrival(obj: any) {
    this.logger.debug('registerArrival', obj);
    const callable = this.functions.httpsCallable('registerArrival');

    // FIXME: https://github.com/firebase/firebase-functions/issues/316
    obj.arrivedAt = obj.arrivedAt.toISOString();

    return callable(obj)
      .then(result => result.data)
      .catch((err: functions.HttpsError) => {
        this.logger.error(err.code, err.message);
        throw err;
      });
  }
}
