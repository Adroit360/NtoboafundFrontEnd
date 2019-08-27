import { LuckyMe } from './luckyMe';
import { Scholarship } from './scholarship';
import { Business } from './business';

export class User {
    id: number;
    username: string;
    email:string;
    phoneNumber:string;
    firstName: string;
    lastName: string;
    token:string;
    luckyMes:any;
    scholarships:Array<Scholarship>;
    businesses:Array<Business>;
    momoDetails:MomoDetails;
    bankDetails:BankDetails;
    preferedMoneyReceptionMethod:string
}

class MomoDetails{
     country : string;

     network : string;

     voucher : string;

     number : string;

     currency : string;
}

class BankDetails{
     BankName : string;

     AccountNumber : string;

     SwiftCode : string;
}