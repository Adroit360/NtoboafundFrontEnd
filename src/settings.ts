const data = {
    urls:{
        apiUrl: "https://ntoboafund.gear.host",
        LocalApiUrl: "https://localhost:44311",
        localKestrelUrl: "http://localhost:5000",
        azure: "https://ntoboafundwebapi.azurewebsites.net"
    },
    payment:{
        publicLive: "FLWPUBK-ad829577696424c994082816ba66b19d-X",
        publicTest: "FLWPUBK_TEST-503c38b00b793ed36643ef08861ebb1d-X"
    }
}
//flutterwave,slydepay,redde
export const settings = {

    currentApiUrl: data.urls.azure,

    paymentGateway:"redde",

    getPublicApi: function (): string {
        return data.payment.publicLive
    },

    slydePayCallbackUrlPrefix:"https://app.slydepay.com.gh/payLIVE/detailsnew.aspx?pay_token=",
    
    reddeCallbackUrlPrefix:"https://checkout.reddeonline.com?token=",

    scholarshipStakeOdds: 100,

    businessStakeOdds: 10,

    luckymeStakeOdds: 10
    
} 


//switching between production and test
//Change the e
//Change the data.payment type
