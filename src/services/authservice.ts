import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { settings } from 'src/settings';
import { User } from 'src/models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    get isAuthenticated(): Boolean {
        return this.checkAuthenticationStatus();
    }
    get currentUser(): User {
        return this.getCurrentUser2();
    }

    constructor(private http: HttpClient, private router: Router) {
        //this.isAuthenticated = this.checkAuthenticationStatus();
    }

    //  images:File[],firstName:string,lastName:string,email: string,phoneNumber:string, password: string,confirmPassword:string
    //{images,firstName,lastName,email,phoneNumber, password,confirmPassword }
    register(formData: FormData) {
        return this.http.post<any>(`${settings.currentApiUrl}/users/register`, formData);
        // .pipe(map(user => {
        //     if (user && user.token) {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('currentUser', JSON.stringify(user));
        //         this.isAuthenticated = true;
        //     }
        //     console.log(user);
        //     return user;
        // }));
    }

    updateUser(formData: FormData) {
        return this.http.put<any>(`${settings.currentApiUrl}/users/update`, formData);
    }

    login(email: any, password: any) {
        return this.http.post<any>(`${settings.currentApiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    checkAuthenticationStatus(): Boolean {

        if (localStorage.getItem("currentUser"))
            return true;

        return false;
    }

    getCurrentUser2(): User {
        //  var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // if(!currentUser){
        //     ///This side is stubborn code .. I'll come back to it
        //     this.router.navigate(["login"]);
        // }
        // return currentUser;
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    hasPaymentDetails(showConfirmBox: boolean = false): boolean {
        if (!this.currentUser)
            return false;

        var rMethod = this.currentUser.preferedMoneyReceptionMethod;

        if (rMethod) {
            switch (rMethod) {
                case "momo":
                    if (this.currentUser.momoDetails.country && this.currentUser.momoDetails.currency && this.currentUser.momoDetails.number && this.currentUser.momoDetails.network) {
                        return true;
                    }
                    else if (showConfirmBox) {
                        this.ChangeDetailsConfirm("Please Setup Mobile Money Payment Details");
                        return false;
                    }

                    return false;
                    break;
                case "bank":
                    if (this.currentUser.bankDetails.AccountNumber && this.currentUser.bankDetails.SwiftCode && this.currentUser.bankDetails.BankName) {
                        return true;
                    }
                    else if (showConfirmBox) {
                        this.ChangeDetailsConfirm("Please Setup Bank Account Details");
                        return false;
                    }
                    return false;
                    break;
                default:
                    return false;
                    break;
            }
        }
        else {
            if (showConfirmBox)
                this.ChangeDetailsConfirm("Give us details of how you want us to pay you when you win.");
            return false;
        }
    }

    ChangeDetailsConfirm(error: string) {
        if (confirm(error)) {
            this.router.navigate(['manage', 'profile'],{queryParams:{returnUrl:this.router.url}});
        }
    }

     getUserRole(userId: string) {
        this.http.get(`${settings.currentApiUrl}/users/exists/${userId}`)
        .subscribe((response:Boolean)=>{
            if(!response)
            {
                localStorage.removeItem("currentUser")
                alert("Sorry we've encountered a problem with your user account. Please login again to fix the issue");
                this.router.navigate(["login"]);
            }
        })
        return this.http.get(`${settings.currentApiUrl}/users/getrole/${userId}`);
    }

}