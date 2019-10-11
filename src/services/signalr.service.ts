import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { ScholarshipParticipant } from 'src/models/Dtos/scholarshipParticipant';
import { Subject } from 'rxjs';
import { settings } from 'src/settings';
import { BusinessParticipant } from 'src/models/Dtos/businessParticpant';
import { LuckymeParticipant } from 'src/models/Dtos/luckymeParticipant';

@Injectable()
export class SignalRService {

    // scholarshipParticipants:Subject<ScholarshipParticipant[]>;
    //The connection to the stakers hub 
    private stakersHubConnection: signalR.HubConnection;
    stakersHubUrl = `${settings.currentApiUrl}/stakers`;
    scholarshipParticipants: ScholarshipParticipant[] = [];
    businessParticipants: BusinessParticipant[] = [];

    dailyLuckymeParticipants: LuckymeParticipant[] = [];
    weeklyLuckymeParticipants: LuckymeParticipant[] = [];
    monthlyLuckymeParticipants: LuckymeParticipant[] = [];
    usersOnline: number;

    potentialDailyLuckymeWinnersCount : number = 0;
    potentialWeeklyLuckymeWinnersCount : number =  0;
    potentialMonthlyLuckymeWinnersCount : number = 0;
    potentialScholarshipWinnersCount : number = 0;
    potentialBusinessWinnersCount : number = 0;
    
    constructor() {
        this.startStakersConnection();
    }
    //build and start the connectiont to the stakers hub
    startStakersConnection() {
        this.stakersHubConnection = new signalR.HubConnectionBuilder().withUrl(this.stakersHubUrl).build()
        this.stakersHubConnection.keepAliveIntervalInMilliseconds = 3600000;
        this.stakersHubConnection.serverTimeoutInMilliseconds = 3600000;
        this.stakersHubConnection.start().then((() => {
            this.initiateGetScholarshipParticipants();
            this.initiateAddScholarshipParticipant();

            this.initiateGetBusinessParticipants();
            this.initiateAddBusinessParticipant();

            this.initiateGetDailyLuckymeParticipants();
            this.initiateAddDailyLuckymeParticipant();

            this.initiateGetWeeklyLuckymeParticipants();
            this.initiateAddWeeklyLuckymeParticipant();

            this.initiateGetMonthlyLuckymeParticipants();
            this.initiateAddMonthlyLuckymeParticipant();


            this.initiateGetPotentialScholarshipWinnersCount();
            this.initiateGetPotentialBusinessWinnersCount();
            this.initiateGetPotentialDailyLuckymeWinnersCount();
            this.initiateGetPotentialWeeklyLuckymeWinnersCount();
            this.initiateGetPotentialMonthlyLuckymeWinnersCount();

            this.initiateNewUserOnline();
        }).bind(this)).catch(() => {
            console.log("Failed to start staker hub connection");
        })
    }

    initiateAddDailyLuckymeParticipant() {
        this.stakersHubConnection.on('adddailyluckymeparticipant', (data: LuckymeParticipant) => {
            this.dailyLuckymeParticipants.push(data);
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialDailyLuckymeWinnersCount");
        });
    }

    initiateAddWeeklyLuckymeParticipant() {
        this.stakersHubConnection.on('addweeklyluckymeparticipant', (data: LuckymeParticipant) => {
            this.weeklyLuckymeParticipants.push(data);
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialWeeklyLuckymeWinnersCount");
        });
    }

    initiateAddMonthlyLuckymeParticipant() {
        this.stakersHubConnection.on('addmonthlyluckymeparticipant', (data: LuckymeParticipant) => {
            this.monthlyLuckymeParticipants.push(data);
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialMonthlyLuckymeWinnersCount");
        });
    }

    initiateAddBusinessParticipant() {
        this.stakersHubConnection.on('addbusinessparticipant', (data: BusinessParticipant) => {
            this.businessParticipants.push(data);
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialBusinessWinnersCount");
        });
    }

    initiateAddScholarshipParticipant() {
        this.stakersHubConnection.on('addscholarshipparticipant', (data: ScholarshipParticipant) => {
            this.scholarshipParticipants.push(data);
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialScholarshipWinnersCount");
        });
    }




    initiateGetDailyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentDailyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.dailyLuckymeParticipants = data;
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialDailyLuckymeWinnersCount");
        });
        this.stakersHubConnection.invoke('GetCurrentDailyLuckymeParticipants');
    }

    initiateGetWeeklyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentWeeklyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.weeklyLuckymeParticipants = data;
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialWeeklyLuckymeWinnersCount");
        });
        this.stakersHubConnection.invoke('GetCurrentWeeklyLuckymeParticipants');
    }

    initiateGetMonthlyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentMonthlyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.monthlyLuckymeParticipants = data;
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialMonthlyLuckymeWinnersCount");

        });
        this.stakersHubConnection.invoke('GetCurrentMonthlyLuckymeParticipants');
    }

    initiateGetBusinessParticipants() {
        this.stakersHubConnection.on('getCurrentBusinessParticipants', (data: BusinessParticipant[]) => {
            //Replace the scholarship participants with this
            this.businessParticipants = data;
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialBusinessWinnersCount");
        });
        //Invoke the GetCurrentScholarshipParticipantMethods
        this.stakersHubConnection.invoke('GetCurrentBusinessParticipants');
    }

    initiateGetScholarshipParticipants() {
        this.stakersHubConnection.on('getCurrentScholarshipParticipants', (data: ScholarshipParticipant[]) => {
            //Replace the scholarship participants with this
            this.scholarshipParticipants = data;
            //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
            this.stakersHubConnection.invoke("getPotentialScholarshipWinnersCount");

        });
        //Invoke the GetCurrentScholarshipParticipantMethods
        this.stakersHubConnection.invoke('GetCurrentScholarshipParticipants');
    }





    initiateGetPotentialScholarshipWinnersCount() {
        this.stakersHubConnection.on("getPotentialScholarshipWinnersCount", (data: number) => {
            this.potentialScholarshipWinnersCount = data;
        });
        //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
        this.stakersHubConnection.invoke("getPotentialScholarshipWinnersCount");
    }

    initiateGetPotentialBusinessWinnersCount() {
        this.stakersHubConnection.on("getPotentialBusinessWinnersCount", (data: number) => {
            this.potentialBusinessWinnersCount = data;
        });
        //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
        this.stakersHubConnection.invoke("getPotentialBusinessWinnersCount");
    }

    initiateGetPotentialDailyLuckymeWinnersCount() {
        this.stakersHubConnection.on("getPotentialDailyLuckymeWinnersCount", (data: number) => {
            this.potentialDailyLuckymeWinnersCount = data;
        });
        //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
        this.stakersHubConnection.invoke("getPotentialDailyLuckymeWinnersCount");
    }

    initiateGetPotentialWeeklyLuckymeWinnersCount() {
        this.stakersHubConnection.on("getPotentialWeeklyLuckymeWinnersCount", (data: number) => {
            this.potentialWeeklyLuckymeWinnersCount = data;
        });
        //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
        this.stakersHubConnection.invoke("getPotentialWeeklyLuckymeWinnersCount");
    }

    initiateGetPotentialMonthlyLuckymeWinnersCount() {
        this.stakersHubConnection.on("getPotentialMonthlyLuckymeWinnersCount", (data: number) => {
            this.potentialMonthlyLuckymeWinnersCount = data;
        });
        //Invoke the get PotentialScholarshipWinnerCount Endpoint on the server
        this.stakersHubConnection.invoke("getPotentialMonthlyLuckymeWinnersCount");
    }

    addDummy(entityType: string, period: string) {
        this.stakersHubConnection.invoke('AddDummyParticipant', entityType, period);
    }

    fixWinner(entityType: string, period: string, winnerId: number) {
        this.stakersHubConnection.invoke('FixWinner', entityType, period, winnerId);
    }

    unfixWinner(entityType: string, period: string, winnerId: number) {
        this.stakersHubConnection.invoke('unfixWinner', entityType, period, winnerId);
    }

    initiateNewUserOnline() {
        this.stakersHubConnection.on('online', (data: number) => {
            this.usersOnline = data;
        });
        this.stakersHubConnection.invoke('OnlineUsersCount');
    }

}