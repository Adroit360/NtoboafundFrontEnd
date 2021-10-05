import { Component, OnInit } from '@angular/core';
import { LuckyMe } from 'src/models/luckyMe';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { UserStatistics } from 'src/models/Dtos/userStatistics';
//import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-mhome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class MHomeComponent implements OnInit {

  luckymes:Array<LuckyMe>;
  userStatistics:UserStatistics
  constructor(private http: HttpClient,private authService: AuthService,private userDashboardService:UserDashBoardService) { }
  
 // public lineChartPlugins = [pluginAnnotations];
  ngOnInit() {
    this.userStatistics = new UserStatistics();
    this.luckymes = new Array<LuckyMe>();
    this.getUserLuckyMes();
    this.userDashboardService.headerText = "Overview";
    this.getUserStatistics();
  }

  getUserLuckyMes(){
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response:Array<LuckyMe>)=>{
          this.luckymes = response;
      },
      error=>{
        console.log(error);
      }
    )
  }

  getUserStatistics(){
    this.http.get(`${settings.currentApiUrl}/users/statistics/${this.authService.currentUser.id}`).subscribe(
      (response:UserStatistics)=>{
          console.log(response);
          this.userStatistics = response;
      },
      error=>{
        console.log(error);
      }
    )

  }
}
