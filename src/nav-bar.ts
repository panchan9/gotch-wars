import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthenticationService } from 'services/firebase/authentication';

@autoinject
export class NavBar {

  open = false;

  constructor(private router: Router, private auth: AuthenticationService) {}

  toggleMenu() {
    console.log(this.open)
    this.open = !this.open;
  }

  onOpen() {}
  onClose() {}

  logout() {
    this.auth.logout();
  }
}
