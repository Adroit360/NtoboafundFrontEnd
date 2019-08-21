import { settings } from 'src/settings';
import { Scholarship } from 'src/models/scholarship';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ScholarshipService {

  /**
   *
   */
  constructor(private http: HttpClient) {
  }
  
  getScholarshipsForUser(userId: number) {
    return this.http.get(`${settings.currentApiUrl}/scholarships/foruser/${userId}`);
  }
}
