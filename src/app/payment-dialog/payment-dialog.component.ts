import { Component, OnInit, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { settings } from "src/settings";
import { PaymentService } from "src/services/payment.service";
import { SignalRService } from "src/services/signalr.service";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-dialog",
  templateUrl: "./payment-dialog.component.html",
  styleUrls: ["./payment-dialog.component.scss"],
})
export class PaymentDialogComponent implements OnInit {
  paymentUrl = "";
  verificationUrl = "";
  cancelationUrl = "";
  settings = settings;
  paymentMethods: string[] = ["MobileMoney", "CreditCard", "SlydePay"];
  selectedPaymentMethod: string = "MobileMoney";
  @Input("amount") amount: number;
  @Input("username") username: string;
  @Input("stakeType") stakeType: string;
  @Input("txRef") txRef: string;
  // @Output("momopayclick") MomoPayClick : EventEmitter<MomoPaymentData> = new EventEmitter();
  // @Output("cardpayclick") CardPayClick : EventEmitter<CardPaymentData>= new EventEmitter();
  // @Output("slydepayclick") SlydePayClick : EventEmitter<SlydePaymentData>= new EventEmitter();
  @Output("close") CloseDialog: EventEmitter<boolean> = new EventEmitter();
  @Output("oncongratmessage") onCongratMessage: EventEmitter<string> =
    new EventEmitter();

  isVodafone: boolean = false;
  paying: boolean = false;
  loading: boolean = false;

  errorMessage: any;
  successMessage: any;
  momoNetwork: string;
  _momoPhoneNumber: string;
  loadingCheckoutUrl: number = 100;
  //opendedCheckoutWindow:any;
  get momoPhoneNumber(): string {
    return this._momoPhoneNumber;
  }
  set momoPhoneNumber(number: string) {
    this._momoPhoneNumber = number;
    if (
      number.startsWith("020") ||
      number.startsWith("050") ||
      number.startsWith("+23350") ||
      number.startsWith("23350") ||
      number.startsWith("+23320") ||
      number.startsWith("23320")
    )
      this.isVodafone = true;
    else this.isVodafone = false;
  }
  //voucher for vodafone users
  voucher: string;
  cardInvoiceEmail: string;

  momoStarVoucherOrEmail: string;

  slydePayEmail: string;
  slydePayPhoneNumber: string;
  checkoutUrl: SafeUrl;


  payTimeout: any;
  payInterval: any;
  
  constructor(
    private http: HttpClient,
    private paymentService: PaymentService,
    private signalRService: SignalRService,
    private sanitizer: DomSanitizer,
    private activatedRoute:ActivatedRoute
  ) {
    let queryParams = activatedRoute.snapshot.queryParams;
    let statusCode = queryParams['code'];
    let txId = queryParams['transaction_id'];
    if (txId && statusCode) {
      // console.log('txStatus', txId, statusCode);
      this.loading = true;
    }
  }

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
    

    if (this.selectedPaymentMethod == this.paymentMethods[0]) {
      if (!this.verifyMomoNumber(this.momoPhoneNumber) && doValidations) {
        this.setErrorMessage("Invalid Phone Number");
        return;
      } else if (this.isVodafone && !this.voucher) {
        this.setErrorMessage("Please generate and enter your voucher");
        return;
      }

      this.setErrorMessage("");
      this.momoStarVoucherOrEmail = this.momoPhoneNumber + "*" + this.voucher;
    } else if (this.selectedPaymentMethod == this.paymentMethods[1]) {
      if (!this.verifyEmailAddress(this.cardInvoiceEmail) && doValidations) {
        this.setErrorMessage("Invalid Email Address");
        return;
      }
      this.setErrorMessage("");
      this.momoStarVoucherOrEmail = this.cardInvoiceEmail
        ? this.cardInvoiceEmail
        : "default";
    }

    if (this.stakeType == "Luckyme") {
      this.paymentUrl = `${settings.currentApiUrl}/transaction/payforluckyme/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      this.verificationUrl = `${settings.currentApiUrl}/transaction/verifyLuckymePayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      this.cancelationUrl = `${settings.currentApiUrl}/transaction/cancelluckymetransaction/${this.txRef}`;
      this.stakeType = "lkm";
    } else if (this.stakeType == "Business") {
      this.paymentUrl = `${settings.currentApiUrl}/transaction/payforbusiness/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      this.verificationUrl = `${settings.currentApiUrl}/transaction/verifybusinessPayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      this.cancelationUrl = `${settings.currentApiUrl}/transaction/cancelbusinesstransaction/${this.txRef}`;
      this.stakeType = "bus";
    } else if (this.stakeType == "Scholarship") {
      this.paymentUrl = `${settings.currentApiUrl}/transaction/payforscholarship/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      this.verificationUrl = `${settings.currentApiUrl}/transaction/verifyscholarshipPayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      this.cancelationUrl = `${settings.currentApiUrl}/transaction/cancelscholarshiptransaction/${this.txRef}`;
      this.stakeType = "sch";
    } else if (this.stakeType == "CrowdFund") {
      this.paymentUrl = `${settings.currentApiUrl}/transaction/payforcrowdfund/${this.txRef}/${this.selectedPaymentMethod}/${this.momoStarVoucherOrEmail}`;
      this.verificationUrl = `${settings.currentApiUrl}/transaction/verifyCrowfundPayment/${this.txRef}?paymentType=${this.selectedPaymentMethod}`;
      this.cancelationUrl = `${settings.currentApiUrl}/transaction/cancelcrowdfundtransaction/${this.txRef}`;
      this.stakeType = "crd";
    }

    this.paying = true;
    //Initiate the payment and send Invoice to the user
    this.http.post<any>(this.paymentUrl + "/" + shouldRedirect, {}).subscribe(
      (response) => {
        console.log(response);

        if (this.selectedPaymentMethod == this.paymentMethods[0]) {
          this.setSuccessMessage("Prompt Sent...Waiting for confirmation..");
          this.verifyPayment();
        } else if (this.selectedPaymentMethod == this.paymentMethods[1]) {
          if (response.paymentToken) {
            if (!shouldRedirect) {
              if (settings.paymentGateway == "slydepay")
                this.setSuccessMessage(
                  "Invoice Sent...Waiting for confirmation.."
                );
            } else {
              var redirectUrl = "";
              if (settings.paymentGateway == "slydepay")
                redirectUrl =
                  settings.slydePayCallbackUrlPrefix + response.paymentToken;
              else if (settings.paymentGateway == "redde")
                redirectUrl =
                  settings.reddeCallbackUrlPrefix + response.paymentToken;
              else if (settings.paymentGateway == "theTeller")
                redirectUrl = response.checkoutUrl;


              this.checkoutUrl =
                this.sanitizer.bypassSecurityTrustResourceUrl(redirectUrl);
              this.loadingCheckoutUrl = 2;
              this.paying = false;
              //this.opendedCheckoutWindow = window.open(redirectUrl, "_blank", 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
              this.setSuccessMessage("Redirected. Waiting for confirmation..");
            }
          }
        }
        
      },
      (xhr) => {
        //If we are here.. then something happened with the payment itself
        this.paying = false;
        if (xhr.error) {
          this.setErrorMessage(xhr.error.message);
        } else this.setErrorMessage("Sorry and error occured");
        console.log(xhr);
        this.closeSlowly();
      }
    );
  }

  /**
   * Close the payment dialog
   * @param showAlert Determines whether to Warn Users before close
   */
  close(showAlert: boolean) {
    if (showAlert) {
      if (confirm("Are you sure you want to cancel this payment")) {
        this.CloseDialog.emit(showAlert);
      }
    } else this.CloseDialog.emit(showAlert);

    clearInterval(this.payInterval);
    clearTimeout(this.payTimeout);
  }

  verifyPayment(){
     //Listen for a new participant with the same reference to be added by signalR
     let paymentSubscription =
     this.signalRService.onNewParticipantAdded.subscribe(
       (txRef: string) => {
         if (txRef == this.txRef) {
           console.log("Equal txrefs");
           clearTimeout(this.payTimeout);
           clearInterval(this.payInterval);
           this.paying = false;
           this.setSuccessMessage("Payment Recieved");
           this.showCongratMessage(this.stakeType, this.txRef);
           this.closeSlowly();
         }
       }
     );
    
     let outgoingResponsePresent = false;
   //Continuosly check for successfull payment for 15 seconds
   
   this.payTimeout = setTimeout(
     (() => {
       //     if(this.selectedPaymentMethod == this.paymentMethods[0]){
        console.log("Interval Hooked");
        clearInterval(this.payInterval);
        this.payInterval = setInterval(() => {
          // console.log("Check Started",outgoingResponsePresent);

          //Prevent another request if no response is gotten from old one
          if(!outgoingResponsePresent)
            outgoingResponsePresent = true
          else
            return;

          console.log("checking...");
          this.http.post<any>(this.verificationUrl, {}).subscribe(
            (vresponse) => {
              console.log("checked");
              console.log(vresponse.status);
              outgoingResponsePresent = false;
              if (vresponse.status == "paid") {
                this.paying = false;
                this.setSuccessMessage("Payment Recieved");
                this.showCongratMessage(this.stakeType, this.txRef);
                this.closeSlowly();
                paymentSubscription.unsubscribe();
                clearInterval(this.payInterval);
              } else if (vresponse.status == "failed") {
                this.paying = false;
                this.setErrorMessage("Payment Failed");
                this.txRef = null;
                this.closeSlowly();
                paymentSubscription.unsubscribe();
                clearInterval(this.payInterval);
              }
            },
            (error) => {
              console.log(error);
              this.paying = false;
              // clearInterval(interval);
            }
          );
        }, 1000);
       // }
     }).bind(this),
     0
   );
  }

  // closeCheckoutWindow(){
  //   if(this.opendedCheckoutWindow)
  //     this.opendedCheckoutWindow.close();
  // }

  closeSlowly() {
    //this.closeCheckoutWindow();
    setTimeout(() => {
      this.close(false);
    }, 3000);
  }

  verifyMomoNumber(phoneNumber: string): boolean {
    if (!phoneNumber) return false;
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
    this.paymentService.getCongratulatoryMessage(stakeType, txRef).subscribe(
      ((data) => {
        this.onCongratMessage.emit(data.message);
      }).bind(this)
    );
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
  }

  checkoutFrameLoaded(data) {
    // debugger;
    // var src = data.path[0].contentWindow.location.href;
    // console.log(src);
    // if (src.includes("ntoboasuccess")) {
    //   this.checkoutUrl = null;
    // } else if (src.includes("ntoboafailure")) {
    //   this.checkoutUrl = null;
    // } else if (
    //   src.includes("luckyme") ||
    //   src.includes("business") ||
    //   src.includes("scholarship")
    // ) {
    //   this.checkoutUrl = null;
    // }
    if(this.loadingCheckoutUrl != 0){
      this.loadingCheckoutUrl -=1;
      return;
    }

    if (settings.paymentGateway == "theTeller") {
      this.verifyPayment();
    }
    console.log("checkouturl", this.checkoutUrl);
  }

  getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
