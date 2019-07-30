import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  currentUser: User;
  apiPath: any;
  isAuthenticated: Boolean;
  isHomePage: boolean;
  constructor(private authenticationService: AuthService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.authenticationStatusChanged()
    this.apiPath = settings.currentApiUrl;
    if (((this.router.snapshot as any)._routerState.url as string).includes("profile")) {
      this.isHomePage = false;
    }else{
      this.isHomePage = true;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.authenticationStatusChanged();
  }

  authenticationStatusChanged() {
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    console.log(this.isAuthenticated);


    if (this.isAuthenticated) {
      this.currentUser = this.authenticationService.getCurrentUser();
    }
  }

  check(page) {
    if (page == "home")
      this.isHomePage = true;
    else
      this.isHomePage = false;

  }

}
