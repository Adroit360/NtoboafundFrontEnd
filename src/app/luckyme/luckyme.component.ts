import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { Router } from '@angular/router';
import { LuckyMe } from 'src/models/luckyMe';

@Component({
  selector: 'app-luckyme',
  templateUrl: './luckyme.component.html',
  styleUrls: ['./luckyme.component.scss']
})
export class LuckymeComponent implements OnInit {

  loading = false;
  selectedChoice = null;
  selectedPeriod = null;
  errorShown = false;
  error = null;
  luckymes:Array<LuckyMe>;
  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.luckymes = new Array<LuckyMe>();
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

  pay() {
    let name = "";
    let unitPrice = "";
    if (this.authService.isAuthenticated) {
      

      if(!this.selectedChoice){
        this.error = "Please Select a Choice";
        this.errorShown = true;
        return;
      }
      if(!this.selectedPeriod){
        this.error = "Please Select a Period";
        this.errorShown = true;
        return;
      }

      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurl`, {amount:this.selectedChoice,period:this.selectedPeriod,userId:this.authService.getCurrentUser().id})
        .subscribe(
          response => {
            this.loading = false;
            this.luckymes.push(response.data.luckyMe);
            window.location.href = response.data.resultString.checkoutUrl;
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

  selectChoice(event,selectedChoice:number){
    if(event.target.checked){
      this.selectedChoice = selectedChoice;
    }
  }

  selectPeriod(event,selectedPeriod:string){

    if(event.target.checked){
      this.selectedPeriod = selectedPeriod;
    }

  }

  closePopup(){
    this.error = null;
    this.errorShown = false;
  }
}
