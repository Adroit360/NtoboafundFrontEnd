import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/authservice';
import { HttpClient } from '@angular/common/http';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user';
import { settings } from 'src/settings';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  currentPage: string = 'overview';
  isAuthenticated: Boolean;
  currentUser: User;
  apiPath = settings.currentApiUrl;
  constructor(private authenticationService: AuthService,private http:HttpClient,
    private router: ActivatedRoute,public userDashboardService:UserDashBoardService) { }

  ngOnInit() {
    this.authenticationStatusChanged();
  }

  navigate(page) {
    this.currentPage = page;
  }

  isOnPage(page) {
    if (page == this.currentPage)
      return true;
    return false;
  }

  logout() {
    this.authenticationService.logout();
    this.authenticationStatusChanged();
  }

  authenticationStatusChanged() {
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    console.log(this.isAuthenticated);


    if (this.isAuthenticated) {
      this.currentUser = this.authenticationService.currentUser
    }
  }

}
