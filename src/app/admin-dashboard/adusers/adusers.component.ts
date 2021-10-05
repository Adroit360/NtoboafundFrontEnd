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
import { AllCommunityModules } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-adusers',
  templateUrl: './adusers.component.html',
  styleUrls: ['./adusers.component.scss']
})
export class AdusersComponent implements OnInit {

  users: Array<User> = [];
  selectedUser: User;
  addUsersShown: boolean = false;
  viewUserDetailsShown: boolean = false;
  loading = false;
  addUserForm: FormGroup;
  gridApi: any;

  usersColumnDefs = [
    { headerName: "FirstName", field: "firstName", sortable: true, filter: true, resizable:true, checkboxSelection: true },
    { headerName: "LastName", field: "lastName", sortable: true, filter: true ,resizable: true},
    { headerName: "Email", field: "email", sortable: true, filter: true,resizable: true },
    { headerName: "PhoneNumber", field: "phoneNumber", sortable: true, filter: true ,resizable: true},
    { headerName: "Type", field: "userType", sortable: true, filter: true,resizable: true }
  ];

  userBusinessStakesColumnDefs = [
    { headerName: "Amount", field: "amount", sortable: true, filter: true ,resizable: true},
    { headerName: "StakeDate", field: "date", sortable: true, filter: true ,resizable: true},
    { headerName: "Status", field: "status", sortable: true, filter: true,resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true ,resizable: true}
  ];

  userScholarshipStakesColumnDefs = [
    { headerName: "Amount", field: "amount", sortable: true, filter: true ,resizable: true},
    { headerName: "StakeDate", field: "date", sortable: true, filter: true ,resizable: true},
    { headerName: "Status", field: "status", sortable: true, filter: true,resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true ,resizable: true}
  ];

  userLuckymeStakesColumnDefs = [
    { headerName: "Amount", field: "amount", sortable: true, filter: true ,resizable: true},
    { headerName: "StakeDate", field: "date", sortable: true, filter: true ,resizable: true},
    { headerName: "Status", field: "status", sortable: true, filter: true,resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true ,resizable: true}
  ];

  usersModule = AllCommunityModules;
  gridColumnApi: any;
  constructor(private usersService: UsersService,
    private luckymeService: LuckymeService,
    private scholarshipService: ScholarshipService,
    private businessService: BusinessService) {
    this.selectedUser = new User();
    this.addUserForm = new FormGroup({});
  }



  ngOnInit() {
    this.usersService.getAll().subscribe((data: Array<User>) => {
      this.users = data;
    })
  }

  usersSelectionChanged(event) {
    //const selectedNodes = agGrid.api.getSelectedNodes();
    //const selectedData = selectedNodes.map(node => node.data);
    var selectedData = this.gridApi.getSelectedRows();
    this.changeSelectedUser(selectedData[0]);
  }

  changeSelectedUser(user: User) {
    if (!user)
      return;

    this.selectedUser = user;
    this.selectedUser.luckyMes = [];
    this.selectedUser.businesses = [];
    this.selectedUser.scholarships = [];
    this.luckymeService.getLuckyMesForUser(user.id).subscribe(((data: Array<LuckyMe>) => {
      this.selectedUser.luckyMes = groupBy("period")(data);

      console.log()
    }).bind(this));

    this.scholarshipService.getScholarshipsForUser(user.id).subscribe(((data: Array<Scholarship>) => {
      this.selectedUser.scholarships = data;
    }).bind(this));

    this.businessService.getBusinessesForUser(user.id).subscribe(((data: Array<Business>) => {
      this.selectedUser.businesses = data;
    }).bind(this));
  }

  onUsersGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  onGridReady(params) {
     params.api.sizeColumnsToFit();
  }

  showOrHideAddUser() {
    this.addUsersShown = !this.addUsersShown;
  }


  showOrHideViewDetails() {
    this.viewUserDetailsShown = !this.viewUserDetailsShown;
  }


  deleteUser() {
    if (confirm(`Are you sure you want to delete ${this.selectedUser.firstName + " " + this.selectedUser.lastName} ?`)) {

      return;
    }
  }

  suspendUser() {
    if (confirm(`Are you sure you want to Suspend ${this.selectedUser.firstName + " " + this.selectedUser.lastName} ?`)) {

      return;
    }
  }

  editUser() {

  }

}
