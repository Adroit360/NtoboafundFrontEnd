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
  fixedDailyLuckyme:LuckyMe;
  fixedWeeklyLuckyme:LuckyMe;
  fixedMonthlyLuckme:LuckyMe;
  
  fixerBoxShown:boolean = false;
  constructor(public luckymeService: LuckymeService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
  }

  ngOnInit() {
  }

  changeSelectedLuckyme(luckymeId: number) {
    this.selectedluckyme = this.luckymeService.getLuckyMeWithId(luckymeId);


    //Dont do a request for the user if it already exists
    if (!this.selectedluckyme.user){
      this.usersService.getUser(this.selectedluckyme.userId).subscribe((user: User) => {
        this.selectedluckyme.user = user;
      });
    }
      
  }

  changeFixedDailyLuckyme(luckymeId: number) {
    this.selectedluckyme = this.luckymeService.getLuckyMeWithId(luckymeId);


    //Dont do a request for the user if it already exists
    if (!this.selectedluckyme.user){
      this.usersService.getUser(this.selectedluckyme.userId).subscribe((user: User) => {
        this.selectedluckyme.user = user;
      });
    }
      
  }

  closeFixerBox(){
    this.fixerBoxShown = false;
  }

  showFixerBox(){
    this.fixerBoxShown = true;
  }

}
