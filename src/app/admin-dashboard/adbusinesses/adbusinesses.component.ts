import { Component, OnInit } from '@angular/core';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';
import { BusinessService } from 'src/services/businesses.service';
import { Business } from 'src/models/business';

@Component({
  selector: 'app-adbusinesses',
  templateUrl: './adbusinesses.component.html',
  styleUrls: ['./adbusinesses.component.scss']
})
export class AdbusinessesComponent implements OnInit {

  selectedbusiness: Business;
  fixedBusiness:Business;
  
  fixerBoxShown:boolean = false;
  constructor(public businessService: BusinessService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
  }

  ngOnInit() {
  }

  changeSelectedBusiness(businessId: number) {
    this.selectedbusiness = this.businessService.getBusinessWithId(businessId);


    //Dont do a request for the user if it already exists
    if (!this.selectedbusiness.user){
      this.usersService.getUser(this.selectedbusiness.userId).subscribe((user: User) => {
        this.selectedbusiness.user = user;
      });
    }
      
  }

  changeFixedDailyBusiness(businessId: number) {
    this.selectedbusiness = this.businessService.getBusinessWithId(businessId);


    //Dont do a request for the user if it already exists
    if (!this.selectedbusiness.user){
      this.usersService.getUser(this.selectedbusiness.userId).subscribe((user: User) => {
        this.selectedbusiness.user = user;
      });
    }
      
  }

  closeFixerBox(){
    this.fixerBoxShown = false;
  }

  showFixerBox(){
    this.fixerBoxShown = true;
  }

}

