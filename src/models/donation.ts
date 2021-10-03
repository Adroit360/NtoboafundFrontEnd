export class Donation{
    id:string;
    userId:string;
    amount:number;
    txRef:string;
    crowdfundId:number;
    paid:boolean;

    constructor(init?:Partial<Donation>){
        Object.assign(this,init);
    }
}