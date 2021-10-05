import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/authservice';
import { HttpClient } from '@angular/common/http';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private authenticationService: AuthService, private http: HttpClient,
    private router:Router,
    public userDashboardService: UserDashBoardService) { }

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

    if (this.isAuthenticated && this.authenticationService.currentUser) {
      this.authenticationService.getUserRole(this.authenticationService.currentUser.id).subscribe((response: any) => {
        if (response.role == "Admin") {
          this.currentUser = this.authenticationService.currentUser;
        } else {
          this.router.navigate(['/login']);
        }
      });
    }
    else {
      this.router.navigate(['/login']);
    }
  }

}
