import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { PaymentService } from 'src/services/payment.service';
import { SignalRService } from 'src/services/signalr.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})

export class PaymentDialogComponent implements OnInit {

  settings = settings;
  paymentMethods: string[] = ['MobileMoney', 'CreditCard', 'SlydePay']
  selectedPaymentMethod: string = "MobileMoney";
  @Input("amount") amount: number;
  @Input("username") username: string;
  @Input("stakeType") stakeType: string;
  @Input("txRef") txRef: string;
  // @Output("momopayclick") MomoPayClick : EventEmitter<MomoPaymentData> = new EventEmitter();
  // @Output("cardpayclick") CardPayClick : EventEmitter<CardPaymentData>= new EventEmitter();
  // @Output("slydepayclick") SlydePayClick : EventEmitter<SlydePaymentData>= new EventEmitter();
  @Output("close") CloseDialog: EventEmitter<boolean> = new EventEmitter();
  @Output("oncongratmessage") onCongratMessage: EventEmitter<string> = new EventEmitter();

  isVodafone: boolean = false;
  paying: boolean = false;

  errorMessage: any;
  successMessage: any;
  momoNetwork: string;
  _momoPhoneNumber: string;
  //opendedCheckoutWindow:any;
  get momoPhoneNumber(): string {
    return this._momoPhoneNumber;
  }
  set momoPhoneNumber(number: string) {
    this._momoPhoneNumber = number;
    if (number.startsWith("020") || number.startsWith("050") || number.startsWith("+23350") || number.startsWith("23350") || number.startsWith("+23320") || number.startsWith("23320"))
      this.isVodafone = true;
    else this.isVodafone = false;
  }
  //voucher for vodafone users
  voucher: string;
  cardInvoiceEmail: string;


  momoStarVoucherOrEmail: string;

  slydePayEmail: string;
  slydePayPhoneNumber: string;
  checkoutUrl:SafeUrl;
  constructor(private http: HttpClient, private paymentService: PaymentService, private signalRService: SignalRService,private sanitizer:DomSanitizer) { }

  ngOnInit() {
  }

  selectPaymentMethod(index: number) {
    this.selectedPaymentMethod = this.paymentMethods[index];
  }

  /**
   * Initiate the payment process
   * @param shouldRedirect Would I need to redirect the user to pay
   * @param doValidations Perform Validations
   */
  Pay(shouldRedirect = false, doValidations = true) {
    let paymentUrl = "";
    let verificationUrl = "";
    let cancelationUrl = "";
    //stake Type used to get congratulatory Message
    let stakeType = "";

    if (this.selectedPaymentMethod == this.paymentMethods[0]) {
      if (!this.verifyMomoNumber(this.momoPhoneNumber) && doValidations) {
        this.setErrorMessage("Invalid Phone Number");
        return;
      }else if(this.isVodafone && !this.voucher){
        this.setErrorMessage("Please generate and enter your voucher");
        return;
      }

      this.setErrorMessage("");
      this.momoStarVoucherOrEmail = this.momoPhoneNumber + "*" + this.voucher;
    }
    else if (this.selectedPaymentMethod == this.paymentMethods[1]) {
      if (!this.verifyEmailAddress(this.cardInvoiceEmail) && doValidations) {
        this.setErrorMessage("Invalid Email Address");
        return;
      }
      this.setErrorMessage("");
      this.momoStarVoucherOrEmail = this.cardInvoiceEmail ? this.cardInvoiceEmail : "default";
    }


    if (this.stakeType == "Luckyme") {
      paymentUrl = `${settings.currentApiUrl}/transaction/payforluckyme/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      verificationUrl = `${settings.currentApiUrl}/transaction/verifyLuckymePayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      cancelationUrl = `${settings.currentApiUrl}/transaction/cancelluckymetransaction/${this.txRef}`;
      stakeType = "lkm";
    }
    else if (this.stakeType == "Business") {
      paymentUrl = `${settings.currentApiUrl}/transaction/payforbusiness/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      verificationUrl = `${settings.currentApiUrl}/transaction/verifybusinessPayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      cancelationUrl = `${settings.currentApiUrl}/transaction/cancelbusinesstransaction/${this.txRef}`;
      stakeType = "bus";
    }
    else if (this.stakeType == "Scholarship") {
      paymentUrl = `${settings.currentApiUrl}/transaction/payforscholarship/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      verificationUrl = `${settings.currentApiUrl}/transaction/verifyscholarshipPayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      cancelationUrl = `${settings.currentApiUrl}/transaction/cancelscholarshiptransaction/${this.txRef}`;
      stakeType = "sch";
    }



    this.paying = true;
    //Initiate the payment and send Invoice to the user
    this.http.post<any>(paymentUrl + "/" + shouldRedirect, {})
      .subscribe(
        response => {
          console.log(response);
          if (this.selectedPaymentMethod == this.paymentMethods[0]) {
            this.setSuccessMessage("Prompt Sent...Waiting for confirmation..");
          }
          else if (this.selectedPaymentMethod == this.paymentMethods[1]) {
            if (response.paymentToken) {
              if (!shouldRedirect) {
                if (settings.paymentGateway == 'slydepay')
                  this.setSuccessMessage("Invoice Sent...Waiting for confirmation..");
              } else {
                var redirectUrl = "";
                if (settings.paymentGateway == 'slydepay')
                  redirectUrl = settings.slydePayCallbackUrlPrefix + response.paymentToken;
                else if (settings.paymentGateway == 'redde')
                  redirectUrl = settings.reddeCallbackUrlPrefix + response.paymentToken;
                this.checkoutUrl = this.sanitizer.bypassSecurityTrustResourceUrl(redirectUrl);
                this.paying = false;
                //this.opendedCheckoutWindow = window.open(redirectUrl, "_blank", 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
                this.setSuccessMessage("Redirected. Waiting for confirmation..");
              }

            }
          }

          var timeout: any;
          var interval: any;

          //Listen for a new participant with the same reference to be added by signalR
          let paymentSubscription = this.signalRService.onNewParticipantAdded.subscribe((txRef: string) => {
            if (txRef == this.txRef) {
              console.log("Equal txrefs");
              clearTimeout(timeout);
              clearInterval(interval);
              this.paying = false;
              this.setSuccessMessage("Payment Recieved");
              this.showCongratMessage(stakeType, this.txRef);
              this.closeSlowly();
            }
          });

          //Continuosly check for successfull payment for 15 seconds
          timeout = setTimeout((() => {
       //     if(this.selectedPaymentMethod == this.paymentMethods[0]){
              console.log("Interval Hooked");
              interval = setInterval(() => {
                console.log("Check Started");
                this.http.post<any>(verificationUrl, {}).subscribe((vresponse) => {
                  console.log(vresponse.status);
                  if (vresponse.status == "paid") {
                    this.paying = false;
                    this.setSuccessMessage("Payment Recieved");
                    this.showCongratMessage(stakeType, this.txRef);
                    this.closeSlowly();
                    paymentSubscription.unsubscribe();
                    clearInterval(interval);
                  } else if (vresponse.status == "failed") {
                    this.paying = false;
                    this.setErrorMessage("Payment Failed");
                    this.txRef = null;
                    this.closeSlowly();
                    paymentSubscription.unsubscribe();
                    clearInterval(interval);
                  }
                }, error => {
                  console.log(error);
                  this.paying = false;
                  clearInterval(interval);
                });
              }, 1000);
           // }
          }).bind(this), 10000)



        },
        xhr => {
          //If we are here.. then something happened with the payment itself
          this.paying = false;
          if (xhr.error) {
            this.setErrorMessage(xhr.error.message);
          }
          else this.setErrorMessage("Sorry and error occured");
          console.log(xhr);
          this.closeSlowly();
        }
      );

  }
  x
  /**
   * Close the payment dialog
   * @param showAlert Determines whether to Warn Users before close
   */
  close(showAlert: boolean) {
    if (showAlert) {
      if (confirm("Are you sure you want to cancel this payment")) {
        this.CloseDialog.emit(showAlert);
      }
    }
    else
      this.CloseDialog.emit(showAlert);
  }

  // closeCheckoutWindow(){
  //   if(this.opendedCheckoutWindow)
  //     this.opendedCheckoutWindow.close();
  // }

  closeSlowly() {
    //this.closeCheckoutWindow();
    setTimeout(() => {
      this.close(false);
    }, 3000)
  }

  verifyMomoNumber(phoneNumber: string): boolean {
    if (!phoneNumber)
      return false;
    else if (phoneNumber.startsWith("0") && phoneNumber.length == 10)
      return true;
    else if (phoneNumber.startsWith("233") && phoneNumber.length == 12)
      return true;
    else if (phoneNumber.startsWith("+233") && phoneNumber.length == 13)
      return true;
    else return false;
  }



  verifyEmailAddress(email: string): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
  }


  /**
   * Get and Show the congratulatory message for the current transaction
   * @param stakeType The Stake Type shortname i.e lkm,bus,sch
   * @param txRef The Unique reference of the current transaction
   */
  showCongratMessage(stakeType: string, txRef: string) {
    this.paymentService.getCongratulatoryMessage(stakeType, txRef).subscribe((data => {
      this.onCongratMessage.emit(data.message);
    }).bind(this));
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
  }

  checkoutFrameLoaded(data){
    var src  = data.path[0].contentWindow.location.href;
    console.log(src);
    if(src.includes("ntoboasuccess")){
      this.checkoutUrl = null;
    }
    else if(src.includes("ntoboafailure")){
      this.checkoutUrl = null;
    }
    else if(src.includes("luckyme") || src.includes("business") ||src.includes("scholarship")){
      this.checkoutUrl = null;
    }
    console.log("checkouturl",this.checkoutUrl);
  }

}

export class MomoPaymentData {
  network: string;
  phoneNumber: string;
}
export class CardPaymentData {
  cardNumber: string;
  validTill: string;
  cvv: string;
}
export class SlydePaymentData {
  email: string;
  phoneNumber: string;
}