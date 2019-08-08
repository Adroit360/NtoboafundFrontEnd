import { Component, OnInit } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';

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
  constructor(private countDownService:CountDownService) {

   }

  ngOnInit() {
    this.countDownService.QuaterlyDaysTime.subscribe((days:number)=>{this.scholarshipDays = days});
    this.countDownService.QuaterlyHoursTime.subscribe((hours:number)=>{this.scholarshipHours = hours});
    this.countDownService.QuaterlyMinutesTime.subscribe((minutes:number)=>{this.scholarshipMinutes = minutes});
    this.countDownService.QuaterlySecondsTime.subscribe((seconds:number)=>{this.scholarshipSeconds = seconds});

  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

}
