import { Component, OnInit } from '@angular/core';
import { LuckyMe } from 'src/models/luckyMe';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';

@Component({
  selector: 'app-mhome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class MHomeComponent implements OnInit {

  luckymes:Array<LuckyMe>;
  constructor(private http: HttpClient,private authService: AuthService) { }

  ngOnInit() {
    this.getUserLuckyMes();
  }
  getUserLuckyMes(){
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.getCurrentUser().id}`).subscribe(
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
