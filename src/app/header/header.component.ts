import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated:Boolean;
  currentUser:User;
  constructor(private authenticationService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    console.log(this.isAuthenticated);

    
    if(this.isAuthenticated){
      this.currentUser = this.authenticationService.getCurrentUser();
    }
  }

}
