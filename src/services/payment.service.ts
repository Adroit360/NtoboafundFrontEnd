import { RaveOptions } from 'angular-rave';
import { AuthService } from './authservice';
import { User } from 'src/models/user';
import { Injectable } from '@angular/core';
import { settings } from 'src/settings';

@Injectable()
export class PaymentService {

    /**
     *
     */
    constructor(private authService: AuthService) {
    }

    getRaveOptions(stakeType: String, amount: number, condition: boolean = true) {
        let paymentOptions: RaveOptions;
        let user = this.authService.currentUser
        if (user) {
            paymentOptions = {
                PBFPubKey: settings.publicLive,
                customer_email: user.email,
                customer_firstname: user.firstName,
                customer_lastname: user.lastName,
                custom_description: `Payment for ${stakeType} stake`,
                amount: amount,
                currency: "GHS",
                country: "GH",
                customer_phone: user.phoneNumber,
                txref: this.getUniqueCode(user),
                custom_title: `${stakeType} Stake Payment`,
                payment_method: "card,account,mobilemoneyghana,bank transfer",
                custom_logo: `${window.location.origin}/assets/images/logo.png`
            }
        }

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



    //     [PBFPubKey] = "'FLWPUBK-XXXXXXXXXXXX'"
    //   [customer_email] = "'user@example.com'"
    //   [customer_phone] = "'08090909090'"
    //   [amount]="500000"
    //   [custom_title]="'Bill Payment'"
    //   [txref]="'USR1295950'"
    //   (callback)="paymentSuccess($event)"
    //   (close)="paymentFailure()"
    //   (init)="paymentInit()"


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
}