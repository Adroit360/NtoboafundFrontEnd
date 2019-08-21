import { CountDownService } from './countdownservice';
import { LuckyMe } from 'src/models/luckyMe';
import { settings } from 'src/settings';
import { AuthService } from './authservice';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';

@Injectable()
export class LuckymeService {
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

  personalLuckymes: Array<LuckyMe>;
  allLuckymes: Array<LuckyMe>;
  /**
   *
   */
  constructor(public countDownService: CountDownService, 
    private authService: AuthService,
    private http: HttpClient,private currentRoute:ActivatedRoute) {
    this.personalLuckymes = new Array<LuckyMe>();
    this.allLuckymes = new Array<LuckyMe>();

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

    this.getAllLuckyMes();

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

  getUserLuckyMes() {
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response: Array<LuckyMe>) => {
        this.personalLuckymes = response;
      },
      error => {
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }

  getLuckyMesForUser(userId:number) {
    return this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${userId}`);
  }

  getAllLuckyMes() {
    this.http.get(`${settings.currentApiUrl}/luckymes`).subscribe(
      (response: Array<LuckyMe>) => {
        this.allLuckymes = response;
      },
      error => {
        console.log("Error getting all luckyme's");
        console.log(error);
      }
    )
  }

  /**
   * Slow since it brings all users plus user navigation properties
   */
  getAllLuckyMesWithUsers() {
    this.http.get(`${settings.currentApiUrl}/luckymes/withusers`).subscribe(
      (response: Array<LuckyMe>) => {
        this.allLuckymes = response;
      },
      error => {
        console.log("Error getting all luckyme's");
        console.log(error);
      }
    )
  }

  getLuckyMeWithId(luckymeId:number):LuckyMe{
   return this.allLuckymes.filter(v=>v.id == luckymeId)[0];
  }

}