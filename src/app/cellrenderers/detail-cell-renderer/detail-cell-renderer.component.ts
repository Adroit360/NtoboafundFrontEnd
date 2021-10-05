import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { LuckyMe } from 'src/models/luckyMe';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-detail-cell-renderer',
  templateUrl: './detail-cell-renderer.component.html',
  styleUrls: ['./detail-cell-renderer.component.scss']
})
export class DetailCellRendererComponent implements ICellRendererAngularComp {

  data:any;

  constructor( private usersService: UsersService){

  }
  // called on init
  agInit(params: any): void {
    //this.firstRecord = params.data.callRecords[0];
    this.data = params.data;
    this.getUserOfData(this.data);
  }

  getUserOfData(selectedData: any) {
    if (!selectedData.user) {
      this.usersService.getUser(selectedData.userId).subscribe((user: User) => {
        selectedData.user = user;
      });
    }

  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return false;
  }
}
