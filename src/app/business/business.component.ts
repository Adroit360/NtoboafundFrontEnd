import { Component, OnInit } from '@angular/core';
import { CountDownService } from 'src/services/countdownservice';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  businessDays:number;
  businessHours:number;
  businessMinutes:number;
  businessSeconds:number;

  selectedAmount:any;
  potentialReturns:any;
  constructor(private countDownService:CountDownService) {

   }

  ngOnInit() {
    this.countDownService.MonthlyDaysTime.subscribe((days:number)=>{this.businessDays = days});
    this.countDownService.MonthlyHoursTime.subscribe((hours:number)=>{this.businessHours = hours});
    this.countDownService.MonthlyMinutesTime.subscribe((minutes:number)=>{this.businessMinutes = minutes});
    this.countDownService.MonthlySecondsTime.subscribe((seconds:number)=>{this.businessSeconds = seconds});

  }

  selectChoice(event,amount){
    this.selectedAmount = amount;
  }

}
