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

  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  pay() {
    let name = "";
    let unitPrice = "";
    if (this.authService.isAuthenticated) {
      this.loading = true;
      this.http.post<any>(`${settings.currentApiUrl}/transaction/pay`, { name, unitPrice })
        .subscribe(
          data => {
            console.log("Success");
            console.log(data);
            this.loading = false;
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
}
