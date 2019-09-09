import { Component, OnInit } from '@angular/core';
import { LuckyMe } from 'src/models/luckyMe';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { UserDashBoardService } from 'src/services/userdashbord.service';
//import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-mhome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class MHomeComponent implements OnInit {

  luckymes:Array<LuckyMe>;
  constructor(private http: HttpClient,private authService: AuthService,private userDashboardService:UserDashBoardService) { }
  
 // public lineChartPlugins = [pluginAnnotations];
  ngOnInit() {
    this.luckymes = new Array<LuckyMe>();
    this.getUserLuckyMes();
    this.userDashboardService.headerText = "Overview";
  }
  getUserLuckyMes(){
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response:Array<LuckyMe>)=>{
          this.luckymes = response;
      },
      error=>{
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }
}
