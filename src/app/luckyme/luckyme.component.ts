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

  selectedChoice: number = null;
  selectedPeriod = null;
  loading = false;
  error = null;
  errorShown = false;
  raveOptions: RaveOptions;

  constructor(private http: HttpClient, public authService: AuthService, public paymentService: PaymentService,
    private router: Router, private currentRoute: ActivatedRoute, public luckymeService: LuckymeService,
    public winnerSelectionService: WinnerSelectionService, public signalRService: SignalRService) { }

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
