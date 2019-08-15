import { User } from './user';

export class Business{
    id:number;
    amount:number;
    date:string;
    period:string;
    status:string;
    amountToWin:number;
    userId:string;
    dateDeclared:boolean;
    user:User;
}