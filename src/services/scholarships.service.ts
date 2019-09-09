import { CountDownService } from './countdownservice';
import { Scholarship } from 'src/models/scholarship';
import { settings } from 'src/settings';
import { AuthService } from './authservice';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';

@Injectable()
export class ScholarshipService {
  // luckyMeDailyHours: number;
  // luckyMeDailyMinutes: number;
  // luckyMeDailySeconds: number;

  personalScholarships: Array<Scholarship>;
  allScholarships: Array<Scholarship>;
  /**
   *
   */
  constructor(public countDownService: CountDownService, 
    private authService: AuthService,
    private http: HttpClient,private currentRoute:ActivatedRoute) {
    this.personalScholarships = new Array<Scholarship>();
    this.allScholarships = new Array<Scholarship>();

    // this.countDownService.DailyHoursTime.subscribe((hours: number) => { this.luckyMeDailyHours = hours });
    // this.countDownService.DailyMinutesTime.subscribe((minutes: number) => { this.luckyMeDailyMinutes = minutes });
    // this.countDownService.DailySecondsTime.subscribe((seconds: number) => { this.luckyMeDailySeconds = seconds });

  
    this.getAllScholarships();

    var checkoutId = this.currentRoute.snapshot.queryParams["checkoutId"];
    if (checkoutId) {
      this.http.delete(`${settings.currentApiUrl}/scholarships/${localStorage.getItem(checkoutId)}`).
        subscribe(
          response => {
            console.log(response);
            this.getUserScholarships()
            localStorage.removeItem(checkoutId)
          },
          error => {
            console.log(error);
            this.getUserScholarships()
          }
        )
    }
    else {
      if (this.authService.isAuthenticated)
          this.getUserScholarships()
    }

  }

  getUserScholarships() {
    this.http.get(`${settings.currentApiUrl}/Scholarships/foruser/${this.authService.currentUser.id}`).subscribe(
      (response: Array<Scholarship>) => {
        this.personalScholarships = response;
      },
      error => {
        console.log("Error getting Scholarships");
        console.log(error);
      }
    )
  }

  getScholarshipsForUser(userId:string) {
    return this.http.get(`${settings.currentApiUrl}/Scholarships/foruser/${userId}`);
  }

  getAllScholarships() {
    return new Promise(
      ((resolve,reject)=>{
        this.http.get(`${settings.currentApiUrl}/scholarships`).subscribe(
          (response: Array<Scholarship>) => {
            this.allScholarships = response;
            resolve(this.allScholarships)
          },
          error => {
            reject(error);
          }
        )
      }).bind(this)
    )
    
  }

  getScholarshipsByType(type:string) {
    return new Promise(
      ((resolve,reject)=>{
        this.http.get(`${settings.currentApiUrl}/scholarships/bytype/${type}`).subscribe(
          (response: Array<Scholarship>) => {
            this.allScholarships = response;
            resolve(this.allScholarships)
          },
          error => {
            reject(error);
          }
        )
      }).bind(this)
    );
    
  }

  /**
   * Slow since it brings all users plus user navigation properties
   */
  getAllScholarshipsWithUsers() {
    this.http.get(`${settings.currentApiUrl}/Scholarships/withusers`).subscribe(
      (response: Array<Scholarship>) => {
        this.allScholarships = response;
      },
      error => {
        console.log("Error getting all Scholarship's");
        console.log(error);
      }
    )
  }

  getScholarshipWithId(ScholarshipId:number):Scholarship{
   return this.allScholarships.filter(v=>v.id == ScholarshipId)[0];
  }

}