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
  winnings:{};
  ObjectKeys = Object.keys;
  apiPath:string;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getUserWinners();
    this.apiPath = settings.currentApiUrl;
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

}
