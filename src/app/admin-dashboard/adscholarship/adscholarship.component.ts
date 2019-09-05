import { Component, OnInit } from '@angular/core';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';
import { ScholarshipService } from 'src/services/scholarships.service';
import { Scholarship } from 'src/models/scholarship';

@Component({
  selector: 'app-adscholarships',
  templateUrl: './adscholarship.component.html',
  styleUrls: ['./adscholarship.component.scss']
})
export class AdScholarshipsComponent implements OnInit {

  selectedscholarship: Scholarship;
  fixedScholarship:Scholarship;
  

  fixerBoxShown: boolean = false;

  participantsToFix: any[];

  recentScholarshipStakes: Scholarship[];

  filterText:string = "all";

  constructor(public scholarshipService: ScholarshipService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.scholarshipService.getAllScholarships().then((value)=>{
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
    });
  }

  changeSelectedScholarship(scholarshipId: number) {
    this.selectedscholarship = this.scholarshipService.getScholarshipWithId(scholarshipId);


    //Dont do a request for the user if it already exists
    if (!this.selectedscholarship.user){
      this.usersService.getUser(this.selectedscholarship.userId).subscribe((user: User) => {
        this.selectedscholarship.user = user;
      });
    }
      
  }

  changeFixedDailyScholarship(scholarshipId: number) {
    this.selectedscholarship = this.scholarshipService.getScholarshipWithId(scholarshipId);


    //Dont do a request for the user if it already exists
    if (!this.selectedscholarship.user){
      this.usersService.getUser(this.selectedscholarship.userId).subscribe((user: User) => {
        this.selectedscholarship.user = user;
      });
    }
      
  }

  closeFixerBox() {
    this.fixerBoxShown = false;
  }

  showFixerBox() {
    this.fixerBoxShown = true;

    this.participantsToFix = this.signalRService.scholarshipParticipants;
  }

  insertDummy() {
    if (confirm("Are you sure you want a new dummy staker fixed ?"))
      this.signalRService.addDummy("scholarship", 'quaterly');
  }

  fixWinner(winnerId: number) {
    this.signalRService.fixWinner('scholarship', 'quaterly', winnerId);

      this.winnerSelectionService.setFixedWinner(winnerId, this.participantsToFix);
  }

  unFixWinner(winnerId: number) {
    this.signalRService.unfixWinner('scholarhip','quaterly', winnerId);
    this.winnerSelectionService.setUnfixedWinner(winnerId, this.participantsToFix);

  }

  filterStaker(value) {
    this.filterText = value;

    if (this.filterText == "all")
      this.recentScholarshipStakes = this.scholarshipService.allScholarships;
    else
      this.recentScholarshipStakes = this.scholarshipService.allScholarships.filter(i => i.status == this.filterText);
  }

  refresh(){
    this.scholarshipService.getAllScholarships().then((value)=>{
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.filterStaker(this.filterText);
    });
  }

  getScholarshipsByType(value){
    this.scholarshipService.getScholarshipsByType(value).then((value)=>{
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.filterStaker(this.filterText);
    });
  }
}
