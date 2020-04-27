import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { HttpClient } from '@angular/common/http';
import { Scholarship } from 'src/models/scholarship';
import { SignalRService } from 'src/services/signalr.service';
import { ScholarshipParticipant } from 'src/models/Dtos/scholarshipParticipant';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { PaymentService } from 'src/services/payment.service';
// import { RaveOptions } from 'angular-rave';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit,AfterViewInit {


  ObjectKeys = Object.keys;

  scholarshipDays:number;
  scholarshipHours:number;
  scholarshipMinutes:number;
  scholarshipSeconds:number;


  loading = false;
  error = null;
  errorShown = false;

  scholarhips: Array<Scholarship> = [];
  scholarshipForm:FormGroup
  raveOptions: any;
  //selectedPlayerType: string;
  congratMsg: string = "";
  congratShown = false;
  selectedAmount:number;
  potentialReturns:string;
  customPaymentDialogShown:boolean;
  settings:any = settings;
  @ViewChild("stakeboxcontroller") stakeBoxController:ElementRef;

  constructor(private countDownService:CountDownService,
              private router:Router,public authService:AuthService
              ,private http:HttpClient,public signalRservice:SignalRService
              ,public winnerSelectionService:WinnerSelectionService,private activatedRoute:ActivatedRoute
              ,public paymentService:PaymentService) {

                //Get All Scholarship participants after the Draw
                this.winnerSelectionService.isQuaterlyDrawOngoing.subscribe((isOngoing:boolean)=>{
                  if(!isOngoing && signalRservice.scholarshipParticipants.length < 1){
                    this.signalRservice.initiateGetScholarshipParticipants();
                  }
                });

                console.log(this.stakeBoxController);
  }

  ngOnInit() {
    this.countDownService.QuaterlyDaysTime.subscribe((days:number)=>{this.scholarshipDays = days});
    this.countDownService.QuaterlyHoursTime.subscribe((hours:number)=>{this.scholarshipHours = hours});
    this.countDownService.QuaterlyMinutesTime.subscribe((minutes:number)=>{this.scholarshipMinutes = minutes});
    this.countDownService.QuaterlySecondsTime.subscribe((seconds:number)=>{this.scholarshipSeconds = seconds});

    this.scholarshipForm = new FormGroup({
      'Institution' : new FormControl('',Validators.required),
      'Program' : new FormControl('',Validators.required),
      'StudentId':new FormControl('',Validators.required),
      'PlayerType':new FormControl('',Validators.required)
    });

  }

  ngAfterViewInit(){
    //Get already entered data from url if present
    var urlData = <string>this.activatedRoute.snapshot.queryParams["urldata"];

    if(urlData){
      //if data is gotten from the query string
      try{
        this.stakeBoxController.nativeElement.checked = true;
        var splittedUrlData = urlData.split('/*/');
        this.scholarshipForm.get("Institution").setValue(splittedUrlData[0]);
        this.scholarshipForm.get("Program").setValue(splittedUrlData[1]);
        this.scholarshipForm.get("StudentId").setValue(splittedUrlData[2]);
        this.scholarshipForm.get("PlayerType").setValue(splittedUrlData[3]);
       //this.ravePayBtn.nativeElement.click();
      // this.paymentInitialized();
      }catch{

      }
     
    }
}

  /**
   * Start the Payment Process
   * @param amount The Scholarship Amount to be paid
   */
  paymentInitialized(_amount?){
    let amount = this.selectedAmount;

    if(_amount)amount = _amount;

    this.scholarshipForm.markAsTouched();
    this.paymentService.paymentInit();
    //Check if scholarship form is valid
    if (!this.scholarshipForm.valid) {
      this.error = "Please fill all form fields";
      this.errorShown = true;
      return;
    }
    // if(!this.selectedPlayerType){
    //   this.errorShown = true;
    //   return;
    // }
    
    //Check if the current user has logged In
    if (this.authService.isAuthenticated) {
      this.selectedAmount = amount;
      this.setRaveOptions(amount);
      let institution = this.scholarshipForm.get("Institution").value;
      let program = this.scholarshipForm.get("Program").value;
      let studentId  = this.scholarshipForm.get("StudentId").value;
      let playerType  = this.scholarshipForm.get("PlayerType").value;
      if(this.authService.hasPaymentDetails(`${institution}/*/${program}/*/${studentId}/*/${this.scholarshipForm.get("PlayerType").value}`,true)){
       this.errorShown = false;
         this.http.post<any>(`${settings.currentApiUrl}/scholarships/addnew`, {amount,institution,program,studentId,playerType:playerType,userId: this.authService.currentUser.id , txRef : this.raveOptions.txref})
          .subscribe(
            response => {
              this.loading = false;
              console.log(response);
              if(settings.paymentGateway == "slydepay"|| settings.paymentGateway == "redde")
                this.customPaymentDialogShown = true;
            },
            error => {
              this.loading = false;
              console.log(error);
            }
          );
      }
    } else {
      this.router.navigate(['login']);
      return;
    }
  }

  paymentFailed(){
    this.paymentService.paymentFailure();
    //this.loading = false;
  }

  scholarshipPaymentCallback(event) {
    this.paymentService.paymentCallback(event);
    if(event.success){
      // let institution = this.scholarshipForm.get("Institution").value;
      // let program = this.scholarshipForm.get("Program").value;
      // let studentId  = this.scholarshipForm.get("StudentId").value;
      // {institution,program,studentId,userId: this.authService.currentUser.id }
        this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyScholarshipPayment/${event.tx.txRef}`,{})
          .subscribe(
            response => {
              //console.log(response);
              this.loading = false;
              this.paymentService.getCongratulatoryMessage("sch", event.tx.txRef).subscribe((data => {
                this.showCongratulatoryMessage(data.message);
              }).bind(this));
  
              //this.scholarhips.push(response.scholarhip);
              if(response.resultString){
              
              }
              this.scholarshipForm.reset();
            },
            error => {
              // console.log("Error");
              // console.log(error);
              this.loading = false;
            }
          );
      
    }else{
      this.loading = false;
    }
    


  }

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


  selectAmount(amount){
    this.selectedAmount = amount;
    this.setPotentialReturns();
    console.log("SelectedAmount",this.selectedAmount);
  }


  getUserScholarships() {
    this.http.get(`${settings.currentApiUrl}/scholarships/foruser/${this.authService.currentUser.id}`).subscribe(
      ((response: Array<Scholarship>) => {
        response.forEach((value) => {
          this.scholarhips.push(value);
        })
      }).bind(this),
      error => {
        console.log("Error getting Scholarships");
        console.log(error);
      }
    )
  
  
  
  }

  setRaveOptions(amount) {
    var isValid = (this.scholarshipForm.valid && this.authService.hasPaymentDetails(`${this.scholarshipForm.get("Institution").value}/*/${this.scholarshipForm.get("Program").value}/*/${this.scholarshipForm.get("StudentId").value}/*/${this.scholarshipForm.get("PlayerType").value}`));

    this.raveOptions = this.paymentService.getRaveOptions('scholarship',amount,isValid);
 }

 proceed(event:Event){
    if(!this.selectedAmount){
      event.preventDefault();
      this.potentialReturns = null;
      this.error = "Please select your investment amount";
    }
 }

 setPotentialReturns() {
   this.error = null;
  this.potentialReturns = ` GH₵ ${(this.selectedAmount * settings.scholarshipStakeOdds).toLocaleString()}`;
}
}
