import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { ActivatedRoute } from '@angular/router';
import { overrideProvider } from '@angular/core/src/view';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { LuckyMe } from 'src/models/luckyMe';
import { Scholarship } from 'src/models/scholarship';
import { Business } from 'src/models/business';
import { HttpClient } from '@angular/common/http';
import { groupBy } from 'src/operations';

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
  luckymes: any;
  scholarships: Array<Scholarship>;
  businesses: Array<Business>;
  constructor(private authenticationService: AuthService,private http:HttpClient,
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
    
    this.getUserLuckyMes();
    this.getUserScholarships();
    this.getUserBusinesses();
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

  getUserLuckyMes() {
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authenticationService.currentUser.id}`).subscribe(
      (data) => {
        this.luckymes = groupBy("period")(data);
      },
      error => {
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }

  getUserScholarships() {
    this.http.get(`${settings.currentApiUrl}/scholarships/foruser/${this.authenticationService.currentUser.id}`).subscribe(
      (data: Array<Scholarship>) => {
        this.scholarships = data;
      },
      error => {
        console.log("Error getting Scholarships");
        console.log(error);
      }
    )
  }

  getUserBusinesses() {
    this.http.get(`${settings.currentApiUrl}/businesses/foruser/${this.authenticationService.currentUser.id}`).subscribe(
      (data: Array<Business>) => {
        this.businesses = data;
      },
      error => {
        console.log("Error getting Businesses");
        console.log(error);
      }
    )
  }

}
