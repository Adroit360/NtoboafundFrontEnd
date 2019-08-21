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
    luckymes:any;
    scholarships:Array<Scholarship>;
    businesses:Array<Business>;
}