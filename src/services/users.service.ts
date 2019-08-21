import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user';
import { settings } from 'src/settings';

@Injectable()
export class UsersService{
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${settings.currentApiUrl}/users`);
    }

    getUser(userId:string){
        return this.http.get<User>(`${settings.currentApiUrl}/users/getuser/${userId}`);
    }


    
}