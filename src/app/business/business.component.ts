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

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
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
        var amount = this.selectedAmount;

        this.loading = true;
      }


    } else {
      this.router.navigate(['login']);
    }


  }

  businessPaymentCallback(event) {
    this.paymentService.paymentCallback(event);
    this.selectedAmount = null; 
    if (event.success) {

      this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyBusinessPayment/${event.tx.txRef}`, { amount: event.tx.amount, userId: this.authService.currentUser.id })
        .subscribe(
          response => {
            console.log(response);
            this.loading = false;
            this.businesses.push(response.business);
            if (response.resultString) {
              let resultString = JSON.parse(response.resultString)
              window.location.href = resultString.data.checkoutUrl;
              localStorage.setItem(resultString.data.checkoutId, response.luckyMe.id);
            }
          },
          error => {
            console.log("Error");
            console.log(error);
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
    console.log(this.potentialReturns);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  }

}
