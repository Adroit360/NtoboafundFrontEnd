import * as signalR from "@aspnet/signalr"
import { settings } from 'src/settings';
import { Scholarship } from 'src/models/scholarship';
import { ScholarshipParticipant } from 'src/models/Dtos/scholarshipParticipant';
import { BusniessParticipant } from 'src/models/Dtos/businessParticpant';
import { LuckymeParticipant } from 'src/models/Dtos/luckymeParticipant';

export class WinnerSelectionService{

    winnerSelectionHubConnection:signalR.HubConnection;
    
    isDailyDrawOngoing = false;
    isWeeklyDrawOngoing = false;
    isMonthlyDrawOngoing = false;
    isQuaterlyDrawOngoing = false;

    currentScholarshipWinner:ScholarshipParticipant;
    scholarshipWinners: ScholarshipParticipant[] = [];

    currentBusinessWinner:ScholarshipParticipant;
    businessWinners: ScholarshipParticipant[] = [];

    currentDailyLuckymeWinner:LuckymeParticipant;
    dailyLuckymeWinners: LuckymeParticipant[] = [];

    currentWeeklyLuckymeWinner:LuckymeParticipant;
    weeklyLuckymeWinners: LuckymeParticipant[] = [];

    currentMonthlyLuckymeWinner:LuckymeParticipant;
    monthlyLuckymeWinners: LuckymeParticipant[] = [];

    winnerSelectionUrl = `${settings.currentApiUrl}/winnerselection`;
    constructor() {
        this.winnerSelectionHubConnection = new signalR.HubConnectionBuilder().withUrl(this.winnerSelectionUrl)
        .build();
        this.winnerSelectionHubConnection.start().then(()=>{
            this.initiateOngoingQuaterlyDraw();
            this.initiateGetScholarshipWinners();
            this.initiatescholarshipWinner();

            this.initiateOngoingMonthlyDraw();
            this.initiateGetBusinessWinners();
            this.initiateBusinessWinner();
            this.initiateGetMonthlyLuckymeWinners();
            this.initiateLuckymeMonthlyWinner();

            this.initiateOngoingWeeklyDraw();
            this.initiateGetWeeklyLuckymeWinners();
            this.initiateLuckymeWeeklyWinner();

            this.initiateOngoingDailyDraw();
            this.initiateGetDailyLuckymeWinners();
            this.initiateLuckymeDailyWinner();
        });
    }

    initiateOngoingQuaterlyDraw(){
        this.winnerSelectionHubConnection.on("ongoingQuaterlyDraw",(data:boolean)=>{
            //boolean response indicates if scholarship draw is ongoing or not
            this.isQuaterlyDrawOngoing= data;
        });
    }

    initiatescholarshipWinner(){
        this.winnerSelectionHubConnection.on("scholarshipWinner",(data:ScholarshipParticipant)=>{
            //number response indicates the Id of the won scholarship
            this.isQuaterlyDrawOngoing = false;
            this.currentScholarshipWinner = data; 
            this.scholarshipWinners.push(data);
            console.log(this.currentScholarshipWinner);
        });
    }

    initiateGetScholarshipWinners() {
        this.winnerSelectionHubConnection.on('getCurrentScholarshipWinners', (data: ScholarshipParticipant[]) => {
            this.scholarshipWinners = data;
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentScholarshipWinners');
    }

    initiateOngoingMonthlyDraw(){
        this.winnerSelectionHubConnection.on("ongoingMonthlyDraw",(data:boolean)=>{
            //boolean response indicates if scholarship draw is ongoing or not
            this.isMonthlyDrawOngoing= data;
        });
    }

    initiateOngoingDailyDraw(){
        this.winnerSelectionHubConnection.on("ongoingDailyDraw",(data:boolean)=>{
            //boolean response indicates if scholarship draw is ongoing or not
            this.isDailyDrawOngoing= data;
        });
    }

    initiateOngoingWeeklyDraw(){
        this.winnerSelectionHubConnection.on("ongoingWeeklyDraw",(data:boolean)=>{
            //boolean response indicates if scholarship draw is ongoing or not
            this.isWeeklyDrawOngoing= data;
        });
    }


    initiateBusinessWinner(){
        this.winnerSelectionHubConnection.on("businessWinner",(data:BusniessParticipant)=>{
            //number response indicates the Id of the won scholarship
            this.isMonthlyDrawOngoing = false;
            this.currentBusinessWinner = data; 
            this.businessWinners.push(data);
            console.log(this.currentBusinessWinner);
        });
    }

    initiateGetBusinessWinners() {
        this.winnerSelectionHubConnection.on('getCurrentBusinessWinners', (data: BusniessParticipant[]) => {
            this.businessWinners = data;
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentBusinessWinners');
    }

    initiateGetMonthlyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentMonthlyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.monthlyLuckymeWinners = data;
            console.log("monthly winners");
            console.log(data);
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentMonthlyLuckymeWinners');
    }

    initiateGetWeeklyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentWeeklyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.weeklyLuckymeWinners = data;
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentWeeklyLuckymeWinners');
    }


    initiateGetDailyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentDailyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.dailyLuckymeWinners = data;
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentDailyLuckymeWinners');
    }


    initiateLuckymeDailyWinner(){
        this.winnerSelectionHubConnection.on("dailyLuckymeWinner",(data:LuckymeParticipant)=>{
            this.isDailyDrawOngoing = false;
            this.currentDailyLuckymeWinner = data; 
            this.dailyLuckymeWinners.push(data);
        });
    }

    initiateLuckymeWeeklyWinner(){
        this.winnerSelectionHubConnection.on("weeklyLuckymeWinner",(data:LuckymeParticipant)=>{
            this.isWeeklyDrawOngoing = false;
            this.currentWeeklyLuckymeWinner = data; 
            this.weeklyLuckymeWinners.push(data);
        });
    }

    initiateLuckymeMonthlyWinner(){
        this.winnerSelectionHubConnection.on("monthlyLuckymeWinner",(data:LuckymeParticipant)=>{
            this.isMonthlyDrawOngoing = false;
            this.currentMonthlyLuckymeWinner = data; 
            this.monthlyLuckymeWinners.push(data);
        });
    }



}