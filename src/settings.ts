const data = {
    urls:{
        apiUrl: "https://ntoboafund.gear.host",
        LocalApiUrl: "https://localhost:44311",
        localKestrelUrl: "https://localhost:5001",
        azure: "https://ntoboafundwebapi.azurewebsites.net"
    },
    payment:{
        publicLive: "FLWPUBK-ad829577696424c994082816ba66b19d-X",
        publicTest: "FLWPUBK_TEST-503c38b00b793ed36643ef08861ebb1d-X"
    }
}
export const settings = {

    currentApiUrl: data.urls.azure,

    getPublicApi: function (): string {
        return data.payment.publicLive;
    },

    scholarshipStakeOdds: 100,

    businessStakeOdds: 10,

    luckymeStakeOdds: 10
} 
