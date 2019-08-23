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
  
  fixerBoxShown:boolean = false;
  constructor(public scholarshipService: ScholarshipService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
  }

  ngOnInit() {
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

  closeFixerBox(){
    this.fixerBoxShown = false;
  }

  showFixerBox(){
    this.fixerBoxShown = true;
  }

}
