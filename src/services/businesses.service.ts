
import { settings } from 'src/settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BusinessService {

  constructor(private http: HttpClient) {
  }

  getBusinessesForUser(userId: number){
    return this.http.get(`${settings.currentApiUrl}/businesses/foruser/${userId}`);
  }
}