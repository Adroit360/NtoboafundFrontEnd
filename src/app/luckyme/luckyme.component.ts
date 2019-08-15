import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { Router, ActivatedRoute } from '@angular/router';
import { LuckyMe } from 'src/models/luckyMe';
import { CountDownService } from 'src/services/countdownservice';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';

@Component({
  selector: 'app-luckyme',
  templateUrl: './luckyme.component.html',
  styleUrls: ['./luckyme.component.scss']
})
export class LuckymeComponent implements OnInit {

  selectedChoice = null;
  selectedPeriod = null;
  loading = false;
  error = null;
  errorShown = false;
  luckymes: Array<LuckyMe>;

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


  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router, private currentRoute: ActivatedRoute, public countDownService: CountDownService
    , public winnerSelectionService: WinnerSelectionService, public signalRService: SignalRService) { }

  ngOnInit() {
    this.loading = false;
    this.luckymes = new Array<LuckyMe>();

    this.countDownService.DailyHoursTime.subscribe((hours: number) => { this.luckyMeDailyHours = hours });
    this.countDownService.DailyMinutesTime.subscribe((minutes: number) => { this.luckyMeDailyMinutes = minutes });
    this.countDownService.DailySecondsTime.subscribe((seconds: number) => { this.luckyMeDailySeconds = seconds });

    this.countDownService.WeeklyDaysTime.subscribe((days: number) => { this.luckyMeWeeklyDays = days });
    this.countDownService.WeeklyHoursTime.subscribe((hours: number) => { this.luckyMeWeeklyHours = hours });
    this.countDownService.WeeklyMinutesTime.subscribe((minutes: number) => { this.luckyMeWeeklyMinutes = minutes });
    this.countDownService.WeeklySecondsTime.subscribe((seconds: number) => { this.luckyMeWeeklySeconds = seconds });

    this.countDownService.MonthlyDaysTime.subscribe((days: number) => { this.luckyMeMonthlyDays = days });
    this.countDownService.MonthlyHoursTime.subscribe((hours: number) => { this.luckyMeMonthlyHours = hours });
    this.countDownService.MonthlyMinutesTime.subscribe((minutes: number) => { this.luckyMeMonthlyMinutes = minutes });
    this.countDownService.MonthlySecondsTime.subscribe((seconds: number) => { this.luckyMeMonthlySeconds = seconds });

    var checkoutId = this.currentRoute.snapshot.queryParams["checkoutId"];
    if (checkoutId) {
      this.http.delete(`${settings.currentApiUrl}/scholarships/${localStorage.getItem(checkoutId)}`).
        subscribe(
          response => {
            console.log(response);
            this.getUserLuckyMes()
            localStorage.removeItem(checkoutId)
          },
          error => {
            console.log(error);
            this.getUserLuckyMes()
          }
        )
    }
    else {
      if (this.authService.isAuthenticated)
        this.getUserLuckyMes()
    }
  }

  pay() {
    let name = "";
    let unitPrice = "";
    if (this.authService.isAuthenticated) {


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

      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurlforluckyme`, { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id })
        .subscribe(
          response => {
            this.loading = false;
            this.luckymes.push(response.luckyMe);
            let resultString = JSON.parse(response.resultString)
            window.location.href = resultString.data.checkoutUrl;
            localStorage.setItem(resultString.data.checkoutId, response.luckyMe.id);
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

  selectChoice(event, selectedChoice: number) {
    if (event.target.checked) {
      this.selectedChoice = selectedChoice;
    }
  }

  selectPeriod(event, selectedPeriod: string) {

    if (event.target.checked) {
      this.selectedPeriod = selectedPeriod;
    }

  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

  getUserLuckyMes() {
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response: Array<LuckyMe>) => {
        response.forEach((value) => {
          this.luckymes.push(value);
        })
      },
      error => {
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }
}
