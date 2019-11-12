import { Component, OnInit } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';
import { SignalRService } from 'src/services/signalr.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { settings } from 'src/settings';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { HttpClient } from '@angular/common/http';
import { Business } from 'src/models/business';
import { PaymentService } from 'src/services/payment.service';
import { RaveOptions } from 'angular-rave';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  ObjectKeys = Object.keys;

  businessDays: number;
  businessHours: number;
  businessMinutes: number;
  businessSeconds: number;

  selectedAmount: any;
  potentialReturns: any;
  loading = false;
  error = null;
  errorShown = false;
  businesses: Array<Business> = [];
  raveOptions: RaveOptions;

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

  constructor(private countDownService: CountDownService,
    private router: Router, public authService: AuthService
    , private http: HttpClient, public signalRservice: SignalRService
    , public winnerSelectionService: WinnerSelectionService, private paymentService: PaymentService) {
    //Get All Business participants after the Draw
    this.winnerSelectionService.isMonthlyDrawOngoing.subscribe((isOngoing: boolean) => {
      if (!isOngoing && signalRservice.businessParticipants.length < 1) {
        this.signalRservice.initiateGetBusinessParticipants();
      }
    });
  }

  ngOnInit() {
    this.countDownService.MonthlyDaysTime.subscribe((days: number) => { this.businessDays = days });
    this.countDownService.MonthlyHoursTime.subscribe((hours: number) => { this.businessHours = hours });
    this.countDownService.MonthlyMinutesTime.subscribe((minutes: number) => { this.businessMinutes = minutes });
    this.countDownService.MonthlySecondsTime.subscribe((seconds: number) => { this.businessSeconds = seconds });

  }

  pay() {
    if (this.authService.isAuthenticated) {

      if(this.authService.hasPaymentDetails(true)){
      //  var amount = this.selectedAmount;

        this.http.post<any>(`${settings.currentApiUrl}/businesses/addnew`, { amount: this.selectedAmount, userId: this.authService.currentUser.id , txRef : this.raveOptions.txref})
          .subscribe(
            response => {
              console.log("business added")
            },
            error => {
              console.log("business not added");
            }
          );
      }


    } else {
      this.router.navigate(['login']);
    }


  }

  businessPaymentCallback(event) {+6
    this.paymentService.paymentCallback(event);
    this.selectedAmount = null; 
    if (event.success) {
      // { amount: event.tx.amount, userId: this.authService.currentUser.id }
      this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyBusinessPayment/${event.tx.txRef}`, {})
        .subscribe(
          response => {
            //console.log(response);
            this.loading = false;
            //this.businesses.push(response.business);
            // if (response.resultString) {
             
            // }
          },
          error => {
            // console.log("Error");
            // console.log(error);
            this.loading = false;
          }
        );

    }
  }

  businessPaymentFailed(){
    this.paymentService.paymentFailure();
    this.selectedAmount = null;
  }

  selectChoice(event, amount) {
    this.selectedAmount = amount;
    this.potentialReturns = amount * settings.businessStakeOdds;
    this.setRaveOptions();
    console.log(this.potentialReturns);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  }

  setRaveOptions() {
    this.raveOptions = this.paymentService.getRaveOptions('Business',this.selectedAmount,this.authService.hasPaymentDetails());
   }
}
