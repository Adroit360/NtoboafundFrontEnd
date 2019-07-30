import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { LuckyMe } from 'src/models/luckyMe';
import { HttpClient } from '@angular/common/http';
import { groupBy } from 'src/operations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  winnings:any;
  ObjectKeys = Object.keys;
  apiPath:string;

  //luckyMeDays:string;
  luckyMeHours:number;
  luckyMeMinutes:number;
  luckyMeSeconds:number;
  luckyMecountDownDate:number ;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getUserWinners();
    this.apiPath = settings.currentApiUrl;
    var d = new Date();
    var ctdate = new Date(d.getMonth()+1 + " " + d.getDate() + "," +d.getFullYear() +" 18:00:00");
    console.log("ctdate");
    console.log(ctdate);
    this.luckyMecountDownDate = ctdate.getTime();
    this.countDown();
  }

  getUserWinners(){
    this.http.get(`${settings.currentApiUrl}/luckymes/winners`).subscribe(
      (response:Array<LuckyMe>)=>{
        response.forEach((value)=>{
        });
        
       this.winnings =  groupBy("dateDeclared")(response);
       console.log(response);
       console.log("Winnnings");
       console.log(this.winnings);
      },
      error=>{
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }

  countDown(){
    setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();
        
      // Find the distance between now and the count down date
      var distance = this.luckyMecountDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      //this.luckyMeDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.luckyMeHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.luckyMeMinutes= Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.luckyMeSeconds = Math.floor((distance % (1000 * 60)) / 1000);
    }.bind(this), 1000);
  }

}
