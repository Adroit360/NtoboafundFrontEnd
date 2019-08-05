import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { FaqService } from 'src/services/faqService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated:Boolean;
  currentUser:User;
  apiPath:string;
  isTogglerChecked:boolean;
  constructor(private authenticationService: AuthService,public faqService:FaqService) { }

  ngOnInit() {
    this.authenticationStatusChanged()
    this.apiPath = settings.currentApiUrl;
    this.isTogglerChecked = false;
  }

  logout(){
    this.authenticationService.logout();
    this.authenticationStatusChanged();
  }

  authenticationStatusChanged(){
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    console.log(this.isAuthenticated);

    
    if(this.isAuthenticated){
      this.currentUser = this.authenticationService.currentUser
    }
  }

  openFaq(){
    this.faqService.isShown = true;
    this.navClicked();
  }

  toggleNavigation(){
    this.isTogglerChecked = !this.isTogglerChecked;
  }

  navClicked(){
    this.isTogglerChecked = false;
  }
}
