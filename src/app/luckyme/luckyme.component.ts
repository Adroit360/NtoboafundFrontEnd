import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { AuthService } from 'src/services/authservice';
import { Router, ActivatedRoute } from '@angular/router';
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
  luckymes: Array<LuckyMe>;
  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router, private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loading = false;
    this.luckymes = new Array<LuckyMe>();

    var checkoutId = this.currentRoute.snapshot.queryParams["checkoutId"];
    if (checkoutId) {
      this.http.delete(`${settings.currentApiUrl}/luckymes/${localStorage.getItem(checkoutId)}`).
        subscribe(
          response => {
            console.log(response);
            this.getUserLuckyMes()
          },
          error => {
            console.log(error);
            this.getUserLuckyMes()
          }
        )
    }
    else {
      if (this.authService.isAuthenticated)
        this.getUserLuckyMes()
    }
  }

  pay() {
    let name = "";
    let unitPrice = "";
    if (this.authService.isAuthenticated) {


      if (!this.selectedChoice) {
        this.error = "Please Select a Choice";
        this.errorShown = true;
        return;
      }
      if (!this.selectedPeriod) {
        this.error = "Please Select a Period";
        this.errorShown = true;
        return;
      }

      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/gethubtelurl`, { amount: this.selectedChoice, period: this.selectedPeriod, userId: this.authService.currentUser.id })
        .subscribe(
          response => {
            this.loading = false;
            this.luckymes.push(response.luckyMe);
            let resultString = JSON.parse(response.resultString)
            window.location.href = resultString.data.checkoutUrl;
            localStorage.setItem(resultString.data.checkoutId, response.luckyMe.id);
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

  selectChoice(event, selectedChoice: number) {
    if (event.target.checked) {
      this.selectedChoice = selectedChoice;
    }
  }

  selectPeriod(event, selectedPeriod: string) {

    if (event.target.checked) {
      this.selectedPeriod = selectedPeriod;
    }

  }

  closePopup() {
    this.error = null;
    this.errorShown = false;
  }

  getUserLuckyMes() {
    this.http.get(`${settings.currentApiUrl}/luckymes/foruser/${this.authService.currentUser.id}`).subscribe(
      (response: Array<LuckyMe>) => {
        response.forEach((value) => {
          this.luckymes.push(value);
        })
      },
      error => {
        console.log("Error getting luckyme's");
        console.log(error);
      }
    )
  }
}
