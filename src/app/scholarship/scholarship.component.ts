import { Component, OnInit } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { HttpClient } from '@angular/common/http';
import { Scholarship } from 'src/models/scholarship';
import { SignalRService } from 'src/services/signalr.service';
import { ScholarshipParticipant } from 'src/models/Dtos/scholarshipParticipant';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { PaymentService } from 'src/services/payment.service';
import { RaveOptions } from 'angular-rave';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {


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
  raveOptions: RaveOptions;
  selectedPlayerType: string;
  congratMsg: string = "";
  congratShown = false;

  constructor(private countDownService:CountDownService,
              private router:Router,public authService:AuthService
              ,private http:HttpClient,public signalRservice:SignalRService
              ,public winnerSelectionService:WinnerSelectionService
              ,public paymentService:PaymentService) {

                //Get All Scholarship participants after the Draw
                this.winnerSelectionService.isQuaterlyDrawOngoing.subscribe((isOngoing:boolean)=>{
                  if(!isOngoing && signalRservice.scholarshipParticipants.length < 1){
                    this.signalRservice.initiateGetScholarshipParticipants();
                  }
                });
  }

  ngOnInit() {
    this.countDownService.QuaterlyDaysTime.subscribe((days:number)=>{this.scholarshipDays = days});
    this.countDownService.QuaterlyHoursTime.subscribe((hours:number)=>{this.scholarshipHours = hours});
    this.countDownService.QuaterlyMinutesTime.subscribe((minutes:number)=>{this.scholarshipMinutes = minutes});
    this.countDownService.QuaterlySecondsTime.subscribe((seconds:number)=>{this.scholarshipSeconds = seconds});

    this.scholarshipForm = new FormGroup({
      'Institution' : new FormControl('',Validators.required),
      'Program' : new FormControl('',Validators.required),
      'StudentId':new FormControl('',Validators.required)
    });

  }

  paymentInitialized(amount){
    this.scholarshipForm.markAsTouched();
    this.paymentService.paymentInit();
    if (this.authService.isAuthenticated) {

      if(this.authService.hasPaymentDetails(true)){
       this.errorShown = false;
        if (!this.scholarshipForm.valid) {
          this.error = "Please fill all form fields";
          this.errorShown = true;
          return;
        }
        if(!this.selectedPlayerType){
          this.errorShown = true;
          return;
        }
       

        let institution = this.scholarshipForm.get("Institution").value;
        let program = this.scholarshipForm.get("Program").value;
        let studentId  = this.scholarshipForm.get("StudentId").value;
  
         this.http.post<any>(`${settings.currentApiUrl}/scholarships/addnew`, {amount,institution,program,studentId,playerType:this.selectedPlayerType,userId: this.authService.currentUser.id , txRef : this.raveOptions.txref})
          .subscribe(
            response => {
              this.scholarshipForm.reset();
            },
            error => {
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
                this.congratMsg = data.message;
                this.congratShown = true;
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

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

  closeCongratPopup() {
    this.congratMsg = null;
    this.congratShown = false;
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

  selectPlayerType(event, selectedPlayerType: string) {

    if (event.target.checked) {
      this.selectedPlayerType = selectedPlayerType;
    }

  }

  setRaveOptions(amount) {
    var isValid = (this.scholarshipForm.valid && this.selectedPlayerType!=undefined && this.authService.hasPaymentDetails());

    this.raveOptions = this.paymentService.getRaveOptions('scholarship',amount,isValid);
 }
}
