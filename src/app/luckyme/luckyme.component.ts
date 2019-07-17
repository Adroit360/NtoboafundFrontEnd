import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { Router } from '@angular/router';

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
  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
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
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurl`, { name, unitPrice })
        .subscribe(
          response => {
            this.loading = false;
            window.location.href = response.data.checkoutUrl;
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
