import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  currentUser:User;
  apiPath: any;
  isAuthenticated: Boolean;
  constructor(private authenticationService: AuthService) { }

  ngOnInit() {
    this.authenticationStatusChanged()
    this.apiPath = settings.currentApiUrl;
  }

  logout(){
    this.authenticationService.logout();
    this.authenticationStatusChanged();
  }

  authenticationStatusChanged(){
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    console.log(this.isAuthenticated);

    
    if(this.isAuthenticated){
      this.currentUser = this.authenticationService.getCurrentUser();
    }
  }

}
