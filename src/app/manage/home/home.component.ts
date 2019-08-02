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
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59,90], label: 'Profits' },
    { data: [28, 48, 40], label: 'Losses' },
    { data: [180, 480, 770], label: 'Series C', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = ['2017','2018','2019'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
 // public lineChartPlugins = [pluginAnnotations];
  ngOnInit() {
    this.luckymes = new Array<LuckyMe>();
    this.getUserLuckyMes();
    this.userDashboardService.headerText = "Overview";
  }
  getUserLuckyMes(){
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response:Array<LuckyMe>)=>{
        response.forEach((value)=>{
          this.luckymes.push(value);
        })
      },
      error=>{
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }
}
