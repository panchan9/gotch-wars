/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import {Aurelia} from 'aurelia-framework';
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import 'material-components-web';
import { getLogger } from 'aurelia-logging';
import { ConfigBuilder } from 'aurelia-mdc-bridge';
import { FirebaseService } from 'services/firebase/firebase';
import { AuthService } from 'services/firebase/auth';
import { BindingSignaler } from 'aurelia-templating-resources';
import * as firebase from 'firebase/app';
import { FirestoreService } from 'services/firebase/firestore';
import { FunctionsService } from 'services/firebase/functions';

// Use Icons and Web Font as self-hosting
// https://medium.com/@daddycat/using-offline-material-icons-and-roboto-font-in-electron-app-f25082447443
// https://google.github.io/material-design-icons/
// import 'material-design-icons/iconfont/material-icons.css';
// import 'roboto-npm-webfont/full/style.css';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia: Aurelia) {

  const logger = getLogger('Middleware');

  aurelia.use
    .standardConfiguration()
    // .plugin(PLATFORM.moduleName('aurelia-mdc-bridge'))
    .plugin(PLATFORM.moduleName('aurelia-mdc-bridge'), chooseMaterialDesignComponents)
    .feature(PLATFORM.moduleName('resources/index'));

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  // Initialize Firebase services
  const firebaseSvc = new FirebaseService(firebase.initializeApp(environment.firebase));
  aurelia.container.registerInstance(FirebaseService, firebaseSvc);

  // Instantiate each Firebase Services
  const signaler = aurelia.container.invoke(BindingSignaler) as BindingSignaler;
  aurelia.container.registerInstance(AuthService, new AuthService(firebaseSvc.app.auth(), signaler));
  aurelia.container.registerInstance(FirestoreService, new FirestoreService(firebaseSvc.app.firestore()));
  // https://firebase.google.com/docs/functions/locations?hl=ja#http_and_client_callable_functions
  aurelia.container.registerInstance(FunctionsService, new FunctionsService(firebaseSvc.app.functions('asia-northeast1')));



  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));

  // const httpClient = aurelia.container.invoke(HttpClient)
  //   .configure((config: HttpClientConfiguration) => {
  //     config
  //       .useStandardConfiguration()
  //       .withBaseUrl(environment.firebase.functionsURL)
  //       .withDefaults({
  //         mode: 'cors',
  //       })
  //       .withInterceptor({
  //         request(req) {
  //           logger.debug(`${req.method} Request: ${req.url}`);
  //           return auth.getIdToken().then(idToken => {
  //             req.headers.set('Authorization', `Bearer ${idToken}`);
  //             return req;
  //           });
  //         },
  //       });
  //   });

  // aurelia.container.registerInstance(HttpClient, httpClient);

}

function chooseMaterialDesignComponents(b: ConfigBuilder) {
  return b
    .useTextFields()
    .useButtons()
    .useCheckboxes()
    .useDialogs()
    .useFab()
    .useLinearProgress()
    .useLists()
    .useRadioButtons()
    .useSelectMenus()
    .useSnackbars()
    .useSwitches()
    .useTemporaryDrawer()
    .useToolbars()
    ;
}
