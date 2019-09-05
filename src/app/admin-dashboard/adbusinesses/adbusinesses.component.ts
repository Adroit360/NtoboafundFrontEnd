import { Component, OnInit } from '@angular/core';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';
import { BusinessService } from 'src/services/businesses.service';
import { Business } from 'src/models/business';
import { Payment } from 'src/models/payment';
import { PaymentService } from 'src/services/payment.service';

@Component({
  selector: 'app-adbusinesses',
  templateUrl: './adbusinesses.component.html',
  styleUrls: ['./adbusinesses.component.scss']
})
export class AdbusinessesComponent implements OnInit {

  selectedbusiness: Business;
  fixedBusiness:Business;
  selectedPaymentDetails:Payment;
  
  fixerBoxShown: boolean = false;

  participantsToFix: any[];

  recentBusinessStakes: Business[];

  filterText:string = "all";

  transactionId:string;
  message: any;
  isMessageShown: boolean;
  constructor(public businessService: BusinessService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService,private paymentService:PaymentService) {
  }

  ngOnInit() {
    this.businessService.getAllBusinesses().then((value)=>{
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
    });
  }

  changeSelectedBusiness(businessId: number) {
    this.selectedbusiness = this.businessService.getBusinessWithId(businessId);


    //Dont do a request for the user if it already exists
    if (!this.selectedbusiness.user){
      this.usersService.getUser(this.selectedbusiness.userId).subscribe((user: User) => {
        this.selectedbusiness.user = user;
      });
    }
    this.paymentService.getPaymentByDetails("business",this.selectedbusiness.id).subscribe(
      (response:Payment)=>{
        if(response){
          this.selectedPaymentDetails = response;
          this.transactionId = this.selectedPaymentDetails.transactionId;

        }
      },
      error=>{}
    )
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

  closeFixerBox() {
    this.fixerBoxShown = false;
  }

  showFixerBox() {
    this.fixerBoxShown = true;

    this.participantsToFix = this.signalRService.businessParticipants;
  }

  insertDummy() {
    if (confirm("Are you sure you want a new dummy staker fixed ?"))
      this.signalRService.addDummy("business", 'monthly');
  }

  fixWinner(winnerId: number) {
    this.signalRService.fixWinner('business', 'monthly', winnerId);

      this.winnerSelectionService.setFixedWinner(winnerId, this.participantsToFix);
  }

  unFixWinner(winnerId: number) {
    this.signalRService.unfixWinner('business','monthly', winnerId);
    this.winnerSelectionService.setUnfixedWinner(winnerId, this.participantsToFix);

  }

  filterStaker(value) {
    this.filterText = value;
    console.log(this.filterText);
    if (this.filterText == "all")
      this.recentBusinessStakes = this.businessService.allBusinesses;
    else
      this.recentBusinessStakes = this.businessService.allBusinesses.filter(i => i.status == this.filterText);
  }

  refresh(){
    this.businessService.getAllBusinesses().then((value)=>{
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
      this.filterStaker(this.filterText);
    });
  }

  getBusinessesByType(value){
    this.businessService.getBusinessesByType(value).then((value)=>{
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
      this.filterStaker(this.filterText);
    });
  }


  addPayment(itemPayedForId:number,userPayedId){
    console.log(this.transactionId);
    var payment = new Payment();
    payment.itemPayedFor = "business";
    payment.itemPayedForId = itemPayedForId;
    payment.transactionId = this.transactionId;
    payment.userPayedId = userPayedId;
    this.paymentService.addPayment(payment).subscribe(response=>{
      this.showMessage("Payment Transaction Id Changed Successfully");
    });
  }

  showMessage(message) {
    this.message = message;
    this.isMessageShown = true;
    setTimeout(function () {
      this.isMessageShown = false;
    }.bind(this), 2000);
  }
}

