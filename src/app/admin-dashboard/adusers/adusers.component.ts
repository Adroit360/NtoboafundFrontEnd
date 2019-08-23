import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';
import { LuckyMe } from 'src/models/luckyMe';
import { LuckymeService } from 'src/services/luckyme.service';
import { ScholarshipService } from 'src/services/scholarships.service';
import { BusinessService } from 'src/services/businesses.service';
import { Scholarship } from 'src/models/scholarship';
import { Business } from 'src/models/business';
import { groupBy } from 'src/operations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adusers',
  templateUrl: './adusers.component.html',
  styleUrls: ['./adusers.component.scss']
})
export class AdusersComponent implements OnInit {

  users: Array<User> = [];
  selectedUser: User;
  addUsersShown:boolean = false;
  viewUserDetailsShown:boolean =false;
  loading  = false;
  addUserForm:FormGroup;
  constructor(private usersService: UsersService,
    private luckymeService:LuckymeService,
    private scholarshipService:ScholarshipService,
    private businessService:BusinessService) {
    this.selectedUser = new User();
    console.log(this.selectedUser.firstName);

    this.addUserForm = new FormGroup({});
  }

  ngOnInit() {
    this.usersService.getAll().subscribe((data: Array<User>) => {
      this.users = data;
      console.log("Users");
      console.log(data);
    })
  }

  changeSelectedUser(user: User) {
    this.selectedUser = user;
    this.selectedUser.luckyMes = [];
    this.selectedUser.businesses = [];
    this.selectedUser.scholarships = [];
    this.luckymeService.getLuckyMesForUser(user.id).subscribe(((data:Array<LuckyMe>)=>{
      this.selectedUser.luckyMes = groupBy("period")(data);
    }).bind(this));

    this.scholarshipService.getScholarshipsForUser(user.id).subscribe(((data:Array<Scholarship>)=>{
      this.selectedUser.scholarships = data;
    }).bind(this));
    
    this.businessService.getBusinessesForUser(user.id).subscribe(((data:Array<Business>)=>{
      this.selectedUser.businesses = data;
    }).bind(this));

    
    console.log(user);
  }


  showOrHideAddUser(){
    this.addUsersShown = !this.addUsersShown;
  }


  showOrHideViewDetails(){
    this.viewUserDetailsShown = !this.viewUserDetailsShown;
  }


  deleteUser(){
    if(confirm(`Are you sure you want to delete ${this.selectedUser.firstName +" "+this.selectedUser.lastName} ?`)){

      return;
    }
  }

  suspendUser(){
    if(confirm(`Are you sure you want to Suspend ${this.selectedUser.firstName +" "+this.selectedUser.lastName} ?`)){

      return;
    }
  }

}
