import * as signalR from "@aspnet/signalr"
import { settings } from 'src/settings';
import { Scholarship } from 'src/models/scholarship';
import { ScholarshipParticipant } from 'src/models/Dtos/scholarshipParticipant';
import { BusinessParticipant } from 'src/models/Dtos/businessParticpant';
import { LuckymeParticipant } from 'src/models/Dtos/luckymeParticipant';
import { Subject, Observable } from 'rxjs';
import { groupBy } from 'src/operations';

export class WinnerSelectionService {

    winnerSelectionHubConnection: signalR.HubConnection;

    isDailyDrawOngoing = false;
    isWeeklyDrawOngoing = false;
    isMonthlyDrawOngoing: Subject<boolean> = new Subject();
    isQuaterlyDrawOngoing: Subject<boolean> = new Subject();

    scholarshipDrawEnded: Subject<boolean>;

    currentScholarshipWinners: ScholarshipParticipant[];
    groupedScholarshipWinners:any;
    scholarshipWinners: ScholarshipParticipant[] = [];

    currentBusinessWinners: BusinessParticipant[];
    groupedBusinessWinners:any;
    businessWinners: BusinessParticipant[] = [];

    currentDailyLuckymeWinners: LuckymeParticipant[];
    groupedDailyLuckymeWinners:any;
    dailyLuckymeWinners: LuckymeParticipant[] = [];

    currentWeeklyLuckymeWinners: LuckymeParticipant[];
    groupedWeeklyLuckymeWinners:any;
    weeklyLuckymeWinners: LuckymeParticipant[] = [];

    currentMonthlyLuckymeWinners: LuckymeParticipant[];
    groupedMonthlyLuckymeWinners:any;
    monthlyLuckymeWinners: LuckymeParticipant[] = [];

    winnerSelectionUrl = `${settings.currentApiUrl}/winnerselection`;
    constructor() {
        this.winnerSelectionHubConnection = new signalR.HubConnectionBuilder().withUrl(this.winnerSelectionUrl)
            .build();
        this.winnerSelectionHubConnection.keepAliveIntervalInMilliseconds = 300000;
        this.winnerSelectionHubConnection.serverTimeoutInMilliseconds = 8.64e+7;
        this.start(this.winnerSelectionHubConnection,this.wireWinnerSelectionEventHandlers);
    }

    async start(hub: signalR.HubConnection, successCallback = undefined) {
        try {
            await hub.start();
            if (successCallback)
                successCallback.call(this);
        } catch (error) {
            window.setTimeout(() => {
                this.start(hub, successCallback);
            }, 5000)
        }
    }

    wireWinnerSelectionEventHandlers(){
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

        this.winnerSelectionHubConnection.onclose(()=>{
            console.log("Winner Selection hub Disconnected.. Reconnecting...");
            this.start(this.winnerSelectionHubConnection);
        });

    }


    initiateOngoingQuaterlyDraw() {
        this.winnerSelectionHubConnection.on("ongoingQuaterlyDraw", (data: boolean) => {
            //boolean response indicates if scholarship draw is ongoing or not
            this.isQuaterlyDrawOngoing.next(data);
        });
    }

    initiatescholarshipWinner() {
        this.winnerSelectionHubConnection.on("scholarshipWinner", (winners: ScholarshipParticipant[]) => {
            //number response indicates the Id of the won scholarship
            this.isQuaterlyDrawOngoing.next(false);
            this.currentScholarshipWinners = winners;
            
            for (const winner of winners) {
                this.scholarshipWinners.push(winner);
            }

            this.groupedScholarshipWinners = groupBy("dateDeclared")(this.scholarshipWinners);
        });
    }

    initiateGetScholarshipWinners() {
        this.winnerSelectionHubConnection.on('getCurrentScholarshipWinners', (data: ScholarshipParticipant[]) => {
            this.scholarshipWinners = data;
            this.groupedScholarshipWinners = groupBy("dateDeclared")(data);
        });
        //Invoke the GetCurrentScholarshipWin
        this.winnerSelectionHubConnection.invoke('GetCurrentScholarshipWinners');
    }

    initiateOngoingMonthlyDraw() {
        this.winnerSelectionHubConnection.on("ongoingMonthlyDraw", (data: boolean) => {
            //boolean response indicates if scholarship draw is ongoing or not
            this.isMonthlyDrawOngoing.next(data);
        });
    }

    initiateOngoingDailyDraw() {
        this.winnerSelectionHubConnection.on("ongoingDailyDraw", (data: boolean) => {
            //boolean response indicates if scholarship draw is ongoing or not
            this.isDailyDrawOngoing = data;
        });
    }

    initiateOngoingWeeklyDraw() {
        this.winnerSelectionHubConnection.on("ongoingWeeklyDraw", (data: boolean) => {
            //boolean response indicates if scholarship draw is ongoing or not
            this.isWeeklyDrawOngoing = data;
        });
    }


    initiateBusinessWinner() {
        this.winnerSelectionHubConnection.on("businessWinner", (winners: BusinessParticipant[]) => {
            //number response indicates the Id of the won scholarship
            this.isMonthlyDrawOngoing.next(false);
            this.currentBusinessWinners = winners;

            for (const winner of winners) {
                this.businessWinners.push(winner);
            }

            this.groupedBusinessWinners = groupBy("dateDeclared")(this.businessWinners);
        });
    }

    initiateGetBusinessWinners() {
        this.winnerSelectionHubConnection.on('getCurrentBusinessWinners', (data: BusinessParticipant[]) => {
            this.businessWinners = data;
            this.groupedBusinessWinners = groupBy("dateDeclared")(data);
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentBusinessWinners');
    }

    initiateGetMonthlyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentMonthlyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.monthlyLuckymeWinners = data;
            this.groupedMonthlyLuckymeWinners = groupBy("dateDeclared")(data);
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentMonthlyLuckymeWinners');
    }

    initiateGetWeeklyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentWeeklyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.weeklyLuckymeWinners = data;
            this.groupedWeeklyLuckymeWinners = groupBy("dateDeclared")(data);
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentWeeklyLuckymeWinners');
    }


    initiateGetDailyLuckymeWinners() {
        this.winnerSelectionHubConnection.on('getCurrentDailyLuckymeWinners', (data: LuckymeParticipant[]) => {
            this.dailyLuckymeWinners = data;
            this.groupedDailyLuckymeWinners = groupBy("dateDeclared")(data);
        });
        //Invoke the GetCurrentScholarshipWinnersMethods
        this.winnerSelectionHubConnection.invoke('GetCurrentDailyLuckymeWinners');
    }


    initiateLuckymeDailyWinner() {
        this.winnerSelectionHubConnection.on("dailyLuckymeWinner", (winners: LuckymeParticipant[]) => {
            this.isDailyDrawOngoing = false;
            this.currentDailyLuckymeWinners = winners;
            for (const winner of winners) {
                this.dailyLuckymeWinners.push(winner);
            }

            this.groupedDailyLuckymeWinners = groupBy("dateDeclared")(this.dailyLuckymeWinners);
        });
    }

    initiateLuckymeWeeklyWinner() {
        this.winnerSelectionHubConnection.on("weeklyLuckymeWinner", (winners: LuckymeParticipant[]) => {
            this.isWeeklyDrawOngoing = false;
            this.currentWeeklyLuckymeWinners = winners;
            for (const winner of winners) {
                this.weeklyLuckymeWinners.push(winner);
            }
            this.groupedWeeklyLuckymeWinners = groupBy("dateDeclared")(this.weeklyLuckymeWinners);
        });
    }

    initiateLuckymeMonthlyWinner() {
        this.winnerSelectionHubConnection.on("monthlyLuckymeWinner", (winners: LuckymeParticipant[]) => {
            this.isMonthlyDrawOngoing.next(false);

            this.currentMonthlyLuckymeWinners = winners;
            for (const winner of winners) {
                
                this.monthlyLuckymeWinners.push(winner);
            }
            this.groupedMonthlyLuckymeWinners = groupBy("dateDeclared")(this.monthlyLuckymeWinners);
        });
    }

    setFixedWinner(winnerId: number, participants: any[]) {
        for (const participant of participants) {
            if (winnerId == participant.id) {
                participant.status = "wins";
            } else {
                participant.status = "paid";
            }
        }
    }

    setUnfixedWinner(winnerId: number, participants: any[]) {
        var participant = participants.filter(i => i.id == winnerId)[0];
        participant.status = "paid";
        console.log(participant);
    }
}