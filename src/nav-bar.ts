import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'services/firebase/auth';

@autoinject
export class NavBar {

  isOpen = false;

  constructor(private router: Router, private auth: AuthService) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.logout();
  }
}
