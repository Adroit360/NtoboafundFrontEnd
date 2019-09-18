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

  scholarshipDays:number;
  scholarshipHours:number;
  scholarshipMinutes:number;
  scholarshipSeconds:number;
  loading = false;
  error = null;
  errorShown = false;
  scholarhips: Array<Scholarship> = [];
  scholarshipForm:FormGroup
  scholarshipAmount:number;
  raveOptions: RaveOptions;
  constructor(private countDownService:CountDownService,
              private router:Router,public authService:AuthService
              ,private http:HttpClient,public signalRservice:SignalRService
              ,public winnerSelectionService:WinnerSelectionService
              ,public paymentService:PaymentService) {
                this.scholarshipAmount = 100;

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

    console.log(this.scholarshipForm);
  }

  paymentInitialized(){
    this.scholarshipForm.markAsTouched();
    this.paymentService.paymentInit();
    if (this.authService.isAuthenticated) {

      if(this.authService.hasPaymentDetails(true)){
        if (!this.scholarshipForm.valid) {
          this.error = "Please fill all form fields";
          this.errorShown = true;
          return;
        }

        let institution = this.scholarshipForm.get("Institution").value;
        let program = this.scholarshipForm.get("Program").value;
        let studentId  = this.scholarshipForm.get("StudentId").value;
  
         this.http.post<any>(`${settings.currentApiUrl}/scholarships/addnew`, {institution,program,studentId,userId: this.authService.currentUser.id , txRef : this.raveOptions.txref})
          .subscribe(
            response => {
              console.log("new scholarship stake added");
              this.scholarshipForm.reset();
            },
            error => {
              console.log("new scholarship stake not added");
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
        // this.http.post<any>(`${settings.currentApiUrl}/transaction/verifyScholarshipPayment/${event.tx.txRef}`, {institution,program,studentId,userId: this.authService.currentUser.id })
        //   .subscribe(
        //     response => {
        //       console.log(response);
        //       this.loading = false;
        //       this.scholarhips.push(response.scholarhip);
        //       if(response.resultString){
              
        //       }
        //       this.scholarshipForm.reset();
        //     },
        //     error => {
        //       console.log("Error");
        //       console.log(error);
        //       this.loading = false;
        //     }
        //   );
      
    }else{
      this.loading = false;
    }
    


  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
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

  setRaveOptions() {
    this.raveOptions = this.paymentService.getRaveOptions('Luckyme',this.scholarshipAmount,(this.scholarshipForm.valid && this.authService.hasPaymentDetails()));
 }
}
