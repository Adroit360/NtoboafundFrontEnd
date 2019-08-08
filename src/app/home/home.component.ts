import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { LuckyMe } from 'src/models/luckyMe';
import { HttpClient } from '@angular/common/http';
import { groupBy } from 'src/operations';
import { CountDownService } from 'src/services/countdownservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {
  
  winnings:any;
  ObjectKeys = Object.keys;
  apiPath:string;

  //luckyMeDays:string;
  luckyMeHours:number;
  luckyMeMinutes:number;
  luckyMeSeconds:number;
  constructor(private http: HttpClient,private countDownService:CountDownService) { }

  ngOnInit() {
    this.getUserWinners();
    this.apiPath = settings.currentApiUrl;
    console.log("Home Logged");
    this.countDownService.DailyHoursTime.subscribe((hours:number)=>{this.luckyMeHours = hours});
    this.countDownService.DailyMinutesTime.subscribe((minutes:number)=>{this.luckyMeMinutes = minutes});
    this.countDownService.DailySecondsTime.subscribe((seconds:number)=>{this.luckyMeSeconds = seconds});
  }

  getUserWinners(){
    this.http.get(`${settings.currentApiUrl}/luckymes/winners`).subscribe(
      (response:Array<LuckyMe>)=>{
        response.forEach((value)=>{
        });
        
       this.winnings =  groupBy("dateDeclared")(response);
       console.log(response);
       console.log("Winnnings");
       console.log(this.winnings);
      },
      error=>{
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }

  ngOnDestroy(): void {
    // this.countDownService.DailyHoursTime.unsubscribe();
    // this.countDownService.DailyMinutesTime.unsubscribe();
    // this.countDownService.DailySecondsTime.unsubscribe();
  }
}
