import { RaveOptions } from 'angular-rave';
import { AuthService } from './authservice';
import { User } from 'src/models/user';
import { Injectable } from '@angular/core';
import { settings } from 'src/settings';
import { HttpClient } from '@angular/common/http';
import { Payment } from 'src/models/payment';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {

    /**
     *
     */
    constructor(private authService: AuthService,private http:HttpClient) {
    }

    getRaveOptions(stakeType: String, amount: number, condition: boolean = true) {
        let paymentOptions: RaveOptions;
        let user = this.authService.currentUser;
        
        if (user) {
            paymentOptions = {
                PBFPubKey: settings.getPublicApi(),
                customer_email: user.email,
                customer_firstname: user.firstName,
                customer_lastname: user.lastName,
                custom_description: `Payment for ${stakeType} stake`,
                amount: amount,
                currency: "GHS",
                country: "GH",
                customer_phone: user.phoneNumber,
                txref: this.getUniqueCode(user),
                custom_title: `${stakeType} Ntoboa Payment`,
                payment_method: "card,account,mobilemoneyghana,bank transfer",
                custom_logo: `${window.location.origin}/assets/images/logo.png`
            }
        }
        // console.log("User");
        // console.log(user);
        // console.log("Payment Options");
        // console.log(paymentOptions);

        //Use Condition to prevent dialog from showing and show user and error message
        if (condition)
            return paymentOptions;
        else
            return null;
            
    }

    getUniqueCode(user: User) {
            var userCode = user.firstName.substr(0, 2) + user.lastName.substr(0, 2);
            var timeStamp = new Date().getTime();
            return `inv.${userCode}.${timeStamp}`;
    }


    // (callback)
    paymentCallback(event) {
        console.log("Payment Succes method called");
        console.log(event);
    }

    //(close)
    paymentFailure() {
        console.log("Payment failure method called");
    }

    //(init)
    paymentInit() {
        console.log("Payment init method called");
    }

    addPayment(payment:Payment){
        payment.payerId = this.authService.currentUser.id.toString();
        return this.http.post(`${settings.currentApiUrl}/payments`,payment);
    }

    getPaymentByDetails(itemPayedFor,itemPayedForId){
        return this.http.get(`${settings.currentApiUrl}/payments/bydetails/${itemPayedFor}/${itemPayedForId}`);
    }

    /**
     * Returns a message congratulating the user on the current Investment   
     * @param type The type of Investment i.e lkm,bus,or sch
     * @param txref the transaction reference of the stake
     */
    getCongratulatoryMessage(type:string,txref:any):Observable<any>{
        return this.http.get(`${settings.currentApiUrl}/payments/congratmsg/${type}/${txref}`);
    }
}