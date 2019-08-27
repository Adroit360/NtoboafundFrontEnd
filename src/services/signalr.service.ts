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

    constructor() {
        this.startStakersConnection();
    }
    //build and start the connectiont to the stakers hub
    startStakersConnection() {
        this.stakersHubConnection = new signalR.HubConnectionBuilder().withUrl(this.stakersHubUrl).build()
         this.stakersHubConnection.start().then((() => {

            console.log("stakersHubConnectionEstablished");
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

        }).bind(this)).catch(() => {
            console.log("Failed to start staker hub connection");
        })
    }

    initiateAddScholarshipParticipant() {
        this.stakersHubConnection.on('addscholarshipparticipant', (data: ScholarshipParticipant) => {
            this.scholarshipParticipants.push(data)
        });
    }

    initiateGetScholarshipParticipants() {
        this.stakersHubConnection.on('getCurrentScholarshipParticipants', (data: ScholarshipParticipant[]) => {
            //Replace the scholarship participants with this
            this.scholarshipParticipants = data;
        });
        //Invoke the GetCurrentScholarshipParticipantMethods
        this.stakersHubConnection.invoke('GetCurrentScholarshipParticipants');
    }

    
    initiateAddBusinessParticipant() {
        this.stakersHubConnection.on('addbusinessparticipant', (data: BusinessParticipant) => {
            this.businessParticipants.push(data)
        });
    }

    initiateGetBusinessParticipants() {
        this.stakersHubConnection.on('getCurrentBusinessParticipants', (data: BusinessParticipant[]) => {
            //Replace the scholarship participants with this
            this.businessParticipants = data;
        });
        //Invoke the GetCurrentScholarshipParticipantMethods
        this.stakersHubConnection.invoke('GetCurrentBusinessParticipants');
    }


    initiateGetDailyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentDailyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.dailyLuckymeParticipants = data;
        });
        this.stakersHubConnection.invoke('GetCurrentDailyLuckymeParticipants');
    }

    initiateGetWeeklyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentWeeklyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.weeklyLuckymeParticipants = data;
        });
        this.stakersHubConnection.invoke('GetCurrentWeeklyLuckymeParticipants');
    }
    
    initiateGetMonthlyLuckymeParticipants() {
        this.stakersHubConnection.on('getCurrentMonthlyLuckymeParticipants', (data: LuckymeParticipant[]) => {
            this.monthlyLuckymeParticipants = data;
        });
        this.stakersHubConnection.invoke('GetCurrentMonthlyLuckymeParticipants');
    }

    initiateAddDailyLuckymeParticipant() {
        this.stakersHubConnection.on('adddailyluckymeparticipant', (data: LuckymeParticipant) => {
            this.dailyLuckymeParticipants.push(data);
            console.log("daily participants");
            console.log(data);
        });
    }

    initiateAddWeeklyLuckymeParticipant() {
        this.stakersHubConnection.on('addweeklyluckymeparticipant', (data: LuckymeParticipant) => {
            this.weeklyLuckymeParticipants.push(data)
        });
    }

    initiateAddMonthlyLuckymeParticipant() {
        this.stakersHubConnection.on('addmonthlyluckymeparticipant', (data: LuckymeParticipant) => {
            this.monthlyLuckymeParticipants.push(data)
        });
    }






}