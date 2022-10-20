import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
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
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  // templateUrl: "../../oldsite/HomePage/homepage.html",
  // styleUrls: ["../../oldsite/HomePage/homepage.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("header") menuElement: ElementRef;
  sticky = false;
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

  HoursTensPlace: number = 0;
  HoursOnesPlace: number = 0;
  MinutesTensPlace: number = 0;
  MinutesOnesPlace: number = 0;
  SecondsTensPlace: number = 0;
  SecondsOnesPlace: number = 0;

  ngOnInit() {
    setInterval((_) => {
      this.HoursTensPlace = Math.floor(Math.random() * 9) + 1;
      this.HoursOnesPlace = Math.floor(Math.random() * 9) + 1;
      this.MinutesTensPlace = Math.floor(Math.random() * 9) + 1;
      this.MinutesOnesPlace = Math.floor(Math.random() * 9) + 1;
      this.SecondsTensPlace = Math.floor(Math.random() * 9) + 1;
      this.SecondsOnesPlace = Math.floor(Math.random() * 9) + 1;
    }, 1000);
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

  @HostListener("window:scroll", ["$event"])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 450) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  scrollToTop() {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 500);
  }
}
