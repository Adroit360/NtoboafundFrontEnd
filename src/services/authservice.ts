import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { settings } from 'src/settings';
import { User } from 'src/models/user';

@Injectable({ providedIn: 'root' })
export class AuthService{
    isAuthenticated:Boolean;

    constructor(private http: HttpClient) {
        this.isAuthenticated = this.checkAuthenticationStatus();
     }

    login(email: string, password: string) {
        return this.http.post<any>(`${settings.apiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                console.log(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    checkAuthenticationStatus():Boolean{

        if(localStorage.getItem("currentUser"))
            return true;
        
        return false;
    }

    getCurrentUser():User{
        return  JSON.parse(localStorage.getItem('currentUser'));
    }
}