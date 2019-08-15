import { Component, OnInit } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';
import { SignalRService } from 'src/services/signalr.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { settings } from 'src/settings';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { HttpClient } from '@angular/common/http';
import { Business } from 'src/models/business';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  businessDays:number;
  businessHours:number;
  businessMinutes:number;
  businessSeconds:number;

  selectedAmount:any;
  potentialReturns:any;
  loading = false;
  error = null;
  errorShown = false;
  businesses: Array<Business> = [];
  closePopup() {
    this.error = null;
    this.errorShown = false;
  }
  constructor(private countDownService:CountDownService,
    private router:Router,private authService:AuthService
    ,private http:HttpClient,public signalRservice:SignalRService
    ,public winnerSelectionService:WinnerSelectionService) {

   }

  ngOnInit() {
    this.countDownService.MonthlyDaysTime.subscribe((days:number)=>{this.businessDays = days});
    this.countDownService.MonthlyHoursTime.subscribe((hours:number)=>{this.businessHours = hours});
    this.countDownService.MonthlyMinutesTime.subscribe((minutes:number)=>{this.businessMinutes = minutes});
    this.countDownService.MonthlySecondsTime.subscribe((seconds:number)=>{this.businessSeconds = seconds});

  }

  pay() {
    if (this.authService.isAuthenticated) {
      var amount  = this.selectedAmount;

      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurlforbusiness`,{amount,userId: this.authService.currentUser.id })
        .subscribe(
          response => {
            console.log(response);
            this.loading = false;
            this.businesses.push(response.business);
            if(response.resultString){
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
    } else {
      this.router.navigate(['login']);
    }


  }
  
  selectChoice(event,amount){
    this.selectedAmount = amount;
  }

}
