import { User } from './user';

export class Scholarship{
    id:number;
    amount:number;
    date:string;
    period:string;
    status:string;
    amountToWin:number;
    userId:string;
    dateDeclared:boolean;
    transferId:number;
    user:User;
    institution:string;
    program:string;
    studentId:string
}