import { Component, OnInit } from '@angular/core';
import { LuckymeService } from 'src/services/luckyme.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { LuckyMe } from 'src/models/luckyMe';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-adluckymes',
  templateUrl: './adluckymes.component.html',
  styleUrls: ['./adluckymes.component.scss']
})
export class AdluckymesComponent implements OnInit {

  selectedluckyme: LuckyMe;

  //selectedWinnerToFix : LuckyMe;

  selectedFixerPeriod: string;

  fixerBoxShown: boolean = false;

  recentLuckymeStakes: LuckyMe[];

  filterText:string = "all";

  participantsToFix: any[];
  constructor(public luckymeService: LuckymeService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
   
  }

  ngOnInit() {
    this.luckymeService.getAllLuckyMes().then((value)=>{
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
    });
  }

  changeSelectedLuckyme(luckymeId: number) {
    this.selectedluckyme = this.luckymeService.getLuckyMeWithId(luckymeId);


    //Dont do a request for the user if it already exists
    if (!this.selectedluckyme.user) {
      this.usersService.getUser(this.selectedluckyme.userId).subscribe((user: User) => {
        this.selectedluckyme.user = user;
        console.clear();
        console.log(this.selectedluckyme);
      });
    }

  }

  // changeFixedDailyLuckyme(luckymeId: number) {
  //   this.selectedWinnerToFix = this.luckymeService.getLuckyMeWithId(luckymeId);


  //   //Dont do a request for the user if it already exists
  //   if (!this.selectedWinnerToFix.user) {
  //     this.usersService.getUser(this.selectedWinnerToFix.userId).subscribe((user: User) => {
  //       this.selectedWinnerToFix.user = user;
  //     });
  //   }

  // }


  closeFixerBox() {
    this.fixerBoxShown = false;
  }

  showFixerBox(period: string) {
    this.fixerBoxShown = true;
    this.selectedFixerPeriod = period;

    if (period == 'daily')
      this.participantsToFix = this.signalRService.dailyLuckymeParticipants;
    else if (period == 'weekly')
      this.participantsToFix = this.signalRService.weeklyLuckymeParticipants;
    else if (period == 'monthly')
      this.participantsToFix = this.signalRService.monthlyLuckymeParticipants;
  }

  insertDummy(period: string) {
    if (confirm("Are you sure you want a new dummy staker fixed ?"))
      this.signalRService.addDummy("luckyme", period);
  }

  fixWinner(winnerId: number) {
    this.signalRService.fixWinner('luckyme', this.selectedFixerPeriod, winnerId);

    this.winnerSelectionService.setFixedWinner(winnerId, this.participantsToFix);
  }

  unFixWinner(winnerId: number) {
    this.signalRService.unfixWinner('luckyme', this.selectedFixerPeriod, winnerId);
    this.winnerSelectionService.setUnfixedWinner(winnerId, this.participantsToFix);

  }

  filterStaker(value) {
    this.filterText = value;

    if (this.filterText == "all")
      this.recentLuckymeStakes = this.luckymeService.allLuckymes;
    else
      this.recentLuckymeStakes = this.luckymeService.allLuckymes.filter(i => i.status == this.filterText);
  }

  refresh(){
    this.luckymeService.getAllLuckyMes().then((value)=>{
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText);
    });
  }

  getLuckymesByType(value){
    this.luckymeService.getLuckymesByType(value).then((value)=>{
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText);
    });
  }

}


