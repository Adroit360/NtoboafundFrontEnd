import { RaveOptions } from 'angular-rave';

export class PaymentService {
    
    paymentOptions: RaveOptions = {
        PBFPubKey: 'FLWPUBK-ad829577696424c994082816ba66b19d-X',
        customer_email: 'justice.addico.ja@gmail.com',
        customer_firstname: 'Ashinze',
        customer_lastname: 'Ekene',
        custom_description: 'Payment for goods',
        amount: 2000,
        currency: "GHS",
        country:"GH",
        customer_phone: '0557560016',
        txref: 'xxx1xxx',
        custom_title:"Pay [Scholarship]",
        payment_method:"card,account,mobilemoneyghana,bank transfer",
        redirect_url:"",
        meta: [{metaname:"flightID", metavalue: "AP1234"}],
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

    constructor() {

    }

    // (callback)
    paymentSuccess(event){
        console.log("Payment Succes method called");
        console.log(event);
    }

    //(close)
    paymentFailure(){
        console.log("Payment failure method called");
    }

    //(init)
    paymentInit(){
        console.log("Payment init method called");
    }
}