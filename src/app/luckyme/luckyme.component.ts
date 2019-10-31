import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { Router, ActivatedRoute } from '@angular/router';
import { LuckyMe } from 'src/models/luckyMe';
import { CountDownService } from 'src/services/countdownservice';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { LuckymeService } from 'src/services/luckyme.service';
import { PaymentService } from 'src/services/payment.service';
import { ReturnStatement } from '@angular/compiler';
import { RaveOptions } from 'angular-rave';

@Component({
  selector: 'app-luckyme',
  templateUrl: './luckyme.component.html',
  styleUrls: ['./luckyme.component.scss']
})
export class LuckymeComponent implements OnInit {

  ObjectKeys = Object.keys;

  selectedChoice: number = null;
  selectedPeriod = null;
  loading = false;
  error = null;
  errorShown = false;
  raveOptions: RaveOptions;


  luckyMeDailyHours: number;
  luckyMeDailyMinutes: number;
  luckyMeDailySeconds: number;

  luckyMeWeeklyDays: number;
  luckyMeWeeklyHours: number;
  luckyMeWeeklyMinutes: number;
  luckyMeWeeklySeconds: number;


  luckyMeMonthlyDays: number;
  luckyMeMonthlyHours: number;
  luckyMeMonthlyMinutes: number;
  luckyMeMonthlySeconds: number;

  constructor(private http: HttpClient, public authService: AuthService, public paymentService: PaymentService,
    private router: Router, private currentRoute: ActivatedRoute,private countDownService:CountDownService,
    public winnerSelectionService: WinnerSelectionService, public signalRService: SignalRService) { 
      
    this.countDownService.DailyHoursTime.subscribe((hours: number) => { this.luckyMeDailyHours = hours });
    this.countDownService.DailyMinutesTime.subscribe((minutes: number) => { this.luckyMeDailyMinutes = minutes });
    this.countDownService.DailySecondsTime.subscribe((seconds: number) => { this.luckyMeDailySeconds = seconds });

    this.countDownService.WeeklyDaysTime.subscribe((days: number) => { this.luckyMeWeeklyDays = days });
    this.countDownService.WeeklyHoursTime.subscribe((hours: number) => { this.luckyMeWeeklyHours = hours });
    this.countDownService.WeeklyMinutesTime.subscribe((minutes: number) => { this.luckyMeWeeklyMinutes = minutes });
    this.countDownService.WeeklySecondsTime.subscribe((seconds: number) => { this.luckyMeWeeklySeconds = seconds });

    this.countDownService.MonthlyDaysTime.subscribe((days: number) => { this.luckyMeMonthlyDays = days;});
    this.countDownService.MonthlyHoursTime.subscribe((hours: number) => { this.luckyMeMonthlyHours = hours });
    this.countDownService.MonthlyMinutesTime.subscribe((minutes: number) => { this.luckyMeMonthlyMinutes = minutes;});
    this.countDownService.MonthlySecondsTime.subscribe((seconds: number) => { this.luckyMeMonthlySeconds = seconds;});

    }

  ngOnInit() {
    this.loading = false;
  }


  paymentInitialized() {
    if (this.authService.isAuthenticated) {
      if (this.authService.hasPaymentDetails(true)) {

        if (!this.selectedChoice) {
          this.error = "Please Select a Choice";
          this.errorShown = true;
          return;
        }
        if (!this.selectedPeriod) {
          this.error = "Please Select a Period";
          this.errorShown = true;
          return;
        }

        this.http.post<any>(`${settings.currentApiUrl}/luckymes/addnew`, { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id, txRef : this.raveOptions.txref })
          .subscribe(
            response => {
              console.log(response);
            },
            error => {
              console.log(error);
            }
          );

      }
    }
    else {
      this.router.navigate(['login']);
    }
  }

  paymentFailed() {
    console.log("this.paymentFailed");
    // this.loading = false;
  }

  luckymePaymentCallback(event) {
    this.paymentService.paymentCallback(event);
    if (event.success) {
      // this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyLuckymePayment/${event.tx.txRef}`, { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id })
      //   .subscribe(
      //     response => {
      //       this.loading = false;
      //       this.luckymeService.personalLuckymes.push(response.luckyMe);
      //       let resultString = JSON.parse(response.resultString)
      //       console.log(response);

      //     },
      //     error => {
      //       console.log(error);
      //       // this.loading = false;
      //     }
      //   );

    } else {
      this.loading = false;
    }
  }

  selectChoice(event, selectedChoice: number) {
    if (event.target.checked) {
      this.selectedChoice = selectedChoice;
      this.setRaveOptions();
    }
  }

  selectPeriod(event, selectedPeriod: string) {

    if (event.target.checked) {
      this.selectedPeriod = selectedPeriod;
      this.setRaveOptions();
    }

  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

  setRaveOptions() {
     this.raveOptions = this.paymentService.getRaveOptions('LuckyMe', this.selectedChoice, (this.selectedChoice && this.selectedPeriod && this.authService.hasPaymentDetails()));
  }




}
