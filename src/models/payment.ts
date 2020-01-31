export class Payment{
    paymentId:number;
    transactionId:string;
    payerId:string;
    itemPayedFor:string;
    itemPayedForId:number;
    datePayed:string;
    userPayedId:string;
    /**
     * This is just here in the frontend for conveniece but not part of the main model
     */
    amount:number;
}