import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { ActivatedRoute } from '@angular/router';
import { overrideProvider } from '@angular/core/src/view';
import { UserDashBoardService } from 'src/services/userdashbord.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  currentUser: User;
  apiPath: any;
  isAuthenticated: Boolean;
  currentPage: string = 'overview';
  constructor(private authenticationService: AuthService,
     private router: ActivatedRoute,public userDashboardService:UserDashBoardService) { }

  ngOnInit() {
    this.authenticationStatusChanged()
    this.apiPath = settings.currentApiUrl;
    var route = ((this.router.snapshot as any)._routerState.url as string);
    if(route == "/manage"){
      this.currentPage = 'overview'
    }
    else{
      this.currentPage = route.replace("/manage/","");
    }
    console.log(this.currentPage);
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

  navigate(page) {
    this.currentPage = page;
  }

  isOnPage(page) {
    if (page == this.currentPage)
      return true;
    return false;
  }

}
