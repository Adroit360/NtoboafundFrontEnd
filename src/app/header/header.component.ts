import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
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
  userRole:string;
  @Input() backgroundColor:string = "transparent";
  @ViewChild("mainElement") mainElement:ElementRef;
  constructor(private authenticationService: AuthService,public faqService:FaqService) { }

  ngOnInit() {
    this.authenticationStatusChanged()
    this.apiPath = settings.currentApiUrl;
    this.isTogglerChecked = false;
    this.mainElement.nativeElement.style.backgroundColor = this.backgroundColor;
  }

  logout(){
    this.authenticationService.logout();
    this.authenticationStatusChanged();
  }

  authenticationStatusChanged(){
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    if(this.isAuthenticated){
      this.currentUser = this.authenticationService.currentUser;
      this.authenticationService.getUserRole(this.currentUser.id).subscribe((response:any)=>{
        this.userRole = response.role;
       // console.log("Success");
        //console.log(response);
      },
      error=>{
        //console.log(error);
        this.logout();
      }
      );
    }
  }

  openFaq(){
    this.faqService.isShown = true;
    this.isTogglerChecked = false;
  }

  toggleNavigation(){
    this.isTogglerChecked = !this.isTogglerChecked;
  }

  navClicked(){
    this.isTogglerChecked = false;
    
    if(this.faqService.isShown)
      this.faqService.isShown = false;
  }
}
