/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import {Aurelia, Container} from 'aurelia-framework';
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import 'material-components-web';
import { getLogger } from 'aurelia-logging';
import { ConfigBuilder } from 'aurelia-mdc-bridge';
import { AuthService } from 'services/firebase/auth';
import { BindingSignaler } from 'aurelia-templating-resources';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
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
  const firebaseApp = firebase.initializeApp(environment.firebase);
  console.info(firebaseApp.auth())
  initializeFirebaseServices(aurelia.container, firebaseApp);

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

function initializeFirebaseServices(container: Container, app: firebase.app.App): void {
  console.debug(app);
  const signaler = container.invoke(BindingSignaler) as BindingSignaler;
  container.registerInstance(AuthService, new AuthService(app.auth(), signaler));

  container.registerInstance(FirestoreService, new FirestoreService(app.firestore()));
  // https://firebase.google.com/docs/functions/locations?hl=ja#http_and_client_callable_functions
  container.registerInstance(FunctionsService, new FunctionsService(app.functions('asia-northeast1')));
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
