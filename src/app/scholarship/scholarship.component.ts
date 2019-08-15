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


  constructor(private countDownService:CountDownService,
              private router:Router,private authService:AuthService
              ,private http:HttpClient,public signalRservice:SignalRService
              ,public winnerSelectionService:WinnerSelectionService) {

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
    })
  }

  pay() {
    let institution = this.scholarshipForm.get("Institution").value;
    let program = this.scholarshipForm.get("Program").value;
    let studentId  = this.scholarshipForm.get("StudentId").value;

    if (this.authService.isAuthenticated) {


      if (!this.scholarshipForm.valid) {
        this.error = "Please fill all form fields";
        this.errorShown = true;
        return;
      }

      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurlforscholarship`, {institution,program,studentId,userId: this.authService.currentUser.id })
        .subscribe(
          response => {
            console.log(response);
            this.loading = false;
            this.scholarhips.push(response.scholarhip);
            if(response.resultString){
              let resultString = JSON.parse(response.resultString)
              window.location.href = resultString.data.checkoutUrl;
              localStorage.setItem(resultString.data.checkoutId, response.luckyMe.id);
            }
            this.scholarshipForm.reset();
          },
          error => {
            console.log("Error");
            console.log(error);
            this.loading = false;
          }
        );
    } else {
      this.router.navigate(['login']);
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

}
