import { CountDownService } from './countdownservice';
import { Business } from 'src/models/business';
import { settings } from 'src/settings';
import { AuthService } from './authservice';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';

@Injectable()
export class BusinessService {
  // luckyMeDailyHours: number;
  // luckyMeDailyMinutes: number;
  // luckyMeDailySeconds: number;

  personalBusinesses: Array<Business>;
  allBusinesses: Array<Business>;
  /**
   *
   */
  constructor(public countDownService: CountDownService, 
    private authService: AuthService,
    private http: HttpClient,private currentRoute:ActivatedRoute) {
    this.personalBusinesses = new Array<Business>();
    this.allBusinesses = new Array<Business>();

    // this.countDownService.DailyHoursTime.subscribe((hours: number) => { this.luckyMeDailyHours = hours });
    // this.countDownService.DailyMinutesTime.subscribe((minutes: number) => { this.luckyMeDailyMinutes = minutes });
    // this.countDownService.DailySecondsTime.subscribe((seconds: number) => { this.luckyMeDailySeconds = seconds });

  
    this.getAllBusinesses();

    var checkoutId = this.currentRoute.snapshot.queryParams["checkoutId"];
    if (checkoutId) {
      this.http.delete(`${settings.currentApiUrl}/businesses/${localStorage.getItem(checkoutId)}`).
        subscribe(
          response => {
            console.log(response);
            this.getUserBusinesses()
            localStorage.removeItem(checkoutId)
          },
          error => {
            console.log(error);
            this.getUserBusinesses()
          }
        )
    }
    else {
      if (this.authService.isAuthenticated)
          this.getUserBusinesses()
    }

  }

  getUserBusinesses() {
    this.http.get(`${settings.currentApiUrl}/Businesses/foruser/${this.authService.currentUser.id}`).subscribe(
      (response: Array<Business>) => {
        this.personalBusinesses = response;
      },
      error => {
        console.log("Error getting Businesses");
        console.log(error);
      }
    )
  }

  getBusinessesForUser(userId:number) {
    return this.http.get(`${settings.currentApiUrl}/Businesses/foruser/${userId}`);
  }

  getAllBusinesses() {
    return new Promise(
      ((resolve,reject)=>{
        this.http.get(`${settings.currentApiUrl}/businesses`).subscribe(
          (response: Array<Business>) => {
            this.allBusinesses = response;
            resolve(this.allBusinesses)
          },
          error => {
            reject(error);
          }
        )
      }).bind(this)
    )
    
  }

  getBusinessesByType(type:string) {
    return new Promise(
      ((resolve,reject)=>{
        this.http.get(`${settings.currentApiUrl}/businesses/bytype/${type}`).subscribe(
          (response: Array<Business>) => {
            this.allBusinesses = response;
            resolve(this.allBusinesses)
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
  getAllBusinessesWithUsers() {
    this.http.get(`${settings.currentApiUrl}/Businesses/withusers`).subscribe(
      (response: Array<Business>) => {
        this.allBusinesses = response;
      },
      error => {
        console.log("Error getting all Business's");
        console.log(error);
      }
    )
  }

  getBusinessWithId(BusinessId:number):Business{
   return this.allBusinesses.filter(v=>v.id == BusinessId)[0];
  }

}