import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "src/models/user";
import { AuthService } from "src/services/authservice";
import { settings } from "src/settings";
import { LuckyMe } from "src/models/luckyMe";
import { HttpClient } from "@angular/common/http";
import { groupBy } from "src/operations";
import { CountDownService } from "src/services/countdownservice";
import { SignalRService } from "src/services/signalr.service";
import { Participant } from "src/models/Dtos/participant";

@Component({
  selector: "app-home",
  // templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss']
  templateUrl: "../../oldsite/HomePage/homepage.html",
  styleUrls: ["../../oldsite/HomePage/homepage.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  winnings: any;
  ObjectKeys = Object.keys;
  apiPath: string;

  //luckyMeDays:string;
  luckyMeHours: number;
  luckyMeMinutes: number;
  luckyMeSeconds: number;
  constructor(
    private http: HttpClient,
    private countDownService: CountDownService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.getUserWinners();
    this.apiPath = settings.currentApiUrl;
    this.countDownService.DailyHoursTime.subscribe((hours: number) => {
      this.luckyMeHours = hours;
    });
    this.countDownService.DailyMinutesTime.subscribe((minutes: number) => {
      this.luckyMeMinutes = minutes;
    });
    this.countDownService.DailySecondsTime.subscribe((seconds: number) => {
      this.luckyMeSeconds = seconds;
    });
  }

  getUserWinners() {
    this.http.get(`${settings.currentApiUrl}/home/allwinners`).subscribe(
      (response: Array<Participant>) => {
        this.winnings = groupBy("dateDeclared")(response);
      },
      (error) => {
        console.log("Error getting luckyme's");
      }
    );
  }

  ngOnDestroy(): void {
    // this.countDownService.DailyHoursTime.unsubscribe();
    // this.countDownService.DailyMinutesTime.unsubscribe();
    // this.countDownService.DailySecondsTime.unsubscribe();
  }
}
