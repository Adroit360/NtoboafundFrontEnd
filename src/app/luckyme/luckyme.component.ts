import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
// import { RaveOptions } from 'angular-rave';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-luckyme',
    templateUrl: './luckyme.component.html',
  styleUrls: ['./luckyme.component.scss']
  // templateUrl: '../../oldsite/Luckyme/LuckymeTextHolder.html',
  // styleUrls: ['../../oldsite/Luckyme/luckymeStyleHolder.scss']
})
export class LuckymeComponent implements OnInit,AfterViewInit {

  ObjectKeys = Object.keys;
  console = console.log;
  selectedChoice: number = 2;
  selectedPeriod = 'daily';
  loading = false;
  error = null;
  errorShown = false;
  congratMsg: string = "";
  congratShown = false;
  customPaymentDialogShown = false;
  raveOptions: any;

  slydepayRedirectUrl:SafeResourceUrl;;


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

  @ViewChild("ravepaybtn") ravePayBtn:ElementRef;

  settings:any = settings;
  ddisplay = "daily";
  constructor(private http: HttpClient, public authService: AuthService, public paymentService: PaymentService,
    private router: Router, private activatedRoute: ActivatedRoute, private countDownService: CountDownService,
    public winnerSelectionService: WinnerSelectionService, public signalRService: SignalRService,public sanitizer:DomSanitizer) {


    this.countDownService.DailyHoursTime.subscribe((hours: number) => { this.luckyMeDailyHours = hours });
    this.countDownService.DailyMinutesTime.subscribe((minutes: number) => { this.luckyMeDailyMinutes = minutes });
    this.countDownService.DailySecondsTime.subscribe((seconds: number) => { this.luckyMeDailySeconds = seconds });

    this.countDownService.WeeklyDaysTime.subscribe((days: number) => { this.luckyMeWeeklyDays = days });
    this.countDownService.WeeklyHoursTime.subscribe((hours: number) => { this.luckyMeWeeklyHours = hours });
    this.countDownService.WeeklyMinutesTime.subscribe((minutes: number) => { this.luckyMeWeeklyMinutes = minutes });
    this.countDownService.WeeklySecondsTime.subscribe((seconds: number) => { this.luckyMeWeeklySeconds = seconds });

    this.countDownService.MonthlyDaysTime.subscribe((days: number) => { this.luckyMeMonthlyDays = days; });
    this.countDownService.MonthlyHoursTime.subscribe((hours: number) => { this.luckyMeMonthlyHours = hours });
    this.countDownService.MonthlyMinutesTime.subscribe((minutes: number) => { this.luckyMeMonthlyMinutes = minutes; });
    this.countDownService.MonthlySecondsTime.subscribe((seconds: number) => { this.luckyMeMonthlySeconds = seconds; });

  }

  ngOnInit() {
    this.loading = false;
  }

  ngAfterViewInit(){
        //Get already entered data from url if present
        var urlData = <string>this.activatedRoute.snapshot.queryParams["urldata"];

        if(urlData){
          //if data is gotten from the query string
          try{
            var splittedUrlData = urlData.split('/*/');
            this.selectedChoice = <number>(<any>splittedUrlData[0]);
            this.selectedPeriod = splittedUrlData[1];
            this.setRaveOptions();
           //this.ravePayBtn.nativeElement.click();
          // this.paymentInitialized();
          }catch{
    
          }
         
        }
  }

  display(display){
    this.ddisplay = display;
  }

  paymentInitialized() {
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

      if (this.authService.hasPaymentDetails(`${this.selectedChoice}/*/${this.selectedPeriod}`,true)) {
        this.loading = true;
        this.setRaveOptions() ;
        this.http.post<any>(`${settings.currentApiUrl}/luckymes/addnew`, { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id, txRef: this.raveOptions.txref })
          .subscribe(
            response => {
              this.loading = false;
               console.log(response);
               
               if(settings.paymentGateway == "slydepay" || settings.paymentGateway == "redde" || settings.paymentGateway == "theTeller"){
                this.customPaymentDialogShown = true;
              //   if(response.paymentToken){
              //     window.location.href = settings.slydePayCallbackUrlPrefix + response.paymentToken;
              //     //this.slydepayRedirectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(settings.slydePayCallbackUrlPrefix + response.paymentToken);
              //    // this.slydPaymentDialogShown = true;
              //   }
              }
            },
            error => {
              this.loading = false;
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
      // { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id }
      this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyLuckymePayment/${event.tx.txRef}`, {})
        .subscribe(
          (response => {
            this.loading = false;

            //Get Congratulatory Message After the transaction is successfully completed
            this.paymentService.getCongratulatoryMessage("luckyme", event.tx.txRef).subscribe((data => {
              this.showCongratulatoryMessage(data.message);
            }).bind(this));
            
            //this.luckymeService.personalLuckymes.push(response.luckyMe);
            // let resultString = JSON.parse(response.resultString);
            //console.log(response);
          }).bind(this),
          error => {
            console.log(error);
            this.loading = false;
          }
        );

    } else {
      this.loading = false;
    }
  }

  resetTxRef(){
    if(settings.paymentGateway == "flutterwave"){
      this.setRaveOptions();
    }
  }

  // selectChoice(event, selectedChoice: number) {
  //   if (event.target.checked) {
  //     this.selectedChoice = selectedChoice;
  //     this.setRaveOptions();
  //   }
  // }

  // selectPeriod(event, selectedPeriod: string) {

  //   if (event.target.checked) {
  //     this.selectedPeriod = selectedPeriod;
  //     this.setRaveOptions();
  //   }

  // }

  showCongratulatoryMessage(message:string){
    this.congratMsg = message;
    this.congratShown = true;
  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }


  closeCongratPopup() {
    this.congratMsg = null;
    this.congratShown = false;
  }

  closePaymentDialog(){
    this.customPaymentDialogShown = false;
  }

  setRaveOptions() {
    this.raveOptions = this.paymentService.getRaveOptions('LuckyMe', this.selectedChoice, (this.selectedChoice && this.selectedPeriod && this.authService.hasPaymentDetails(`${this.selectedChoice}/*/${this.selectedPeriod}`)));
  }

  /**
   * This Method Returns  the string telling the user how much he gets from his stake
   * @param stakeAmount The Amount the use Chooses to stake
   */
  getReturnsText(stakeAmount: number = 0) {
    return ` GH₵ ${stakeAmount * settings.luckymeStakeOdds}`;
  }

}
