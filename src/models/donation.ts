export class Donation{
    id:string;
    userId:string;
    amountDonated:number;
    txRef:string;
    crowdfundId:number;
    paid:boolean;

    constructor(init?:Partial<Donation>){
        Object.assign(this,init);
    }
}