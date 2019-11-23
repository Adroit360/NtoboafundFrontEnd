import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LuckymeService } from 'src/services/luckyme.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { LuckyMe } from 'src/models/luckyMe';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/models/user';
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { DetailCellRendererComponent } from 'src/app/cellrenderers/detail-cell-renderer/detail-cell-renderer.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-adluckymes',
  templateUrl: './adluckymes.component.html',
  styleUrls: ['./adluckymes.component.scss']
})
export class AdluckymesComponent implements OnInit {

  @ViewChild("cboPartType") cboPartType: ElementRef;
  selectedluckyme: LuckyMe;

  //selectedWinnerToFix : LuckyMe;

  selectedFixerPeriod: string;

  fixerBoxShown: boolean = false;
  paymentBoxShown: boolean = false;

  recentLuckymeStakes: LuckyMe[];

  usersTypeFilterText = "all";
  filterText: string = "all";

  participantsToFix: any[];

  unpdaidWinnersCount: number;

  gridApi: any;
  // checkboxSelection: true,
  luckymeColumnDefs = [
    { headerName: "Period", field: "period", sortable: true, filter: true, resizable: true, cellRenderer: "agGroupCellRenderer" },
    { headerName: "Date", field: "date", sortable: true, filter: true, resizable: true },
    { headerName: "Investment(GHS)", field: "amount", sortable: true, filter: true, resizable: true },
    { headerName: "Status", field: "status", sortable: true, filter: true, resizable: true },
    { headerName: "AmountToWin", field: "amountToWin", sortable: true, filter: true, resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true, resizable: true }
  ];
  luckymeModule = AllModules;
  gridColumnApi: any;
  detailCellRenderer: any;
  detailRowHeight: number;
  groupDefaultExpanded: number;
  frameworkComponents: { myDetailCellRenderer: typeof DetailCellRendererComponent; };

  mainHeaderText = "Luckyme Investments";
  paymentForm :FormGroup;
  canUserBePaid: boolean = false;

  constructor(public luckymeService: LuckymeService, public winnerSelectionService: WinnerSelectionService
    , public signalRService: SignalRService, private usersService: UsersService) {
    this.detailCellRenderer = 'myDetailCellRenderer';
    this.detailRowHeight = 170;
    this.frameworkComponents = { myDetailCellRenderer: DetailCellRendererComponent }
    this.paymentForm = new FormGroup({
      'amount':new FormControl(null,[Validators.required]),
      'reference':new FormControl(null,[Validators.required])
    })
  }

  ngOnInit() {
    this.luckymeService.getAllLuckyMes().then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.unpdaidWinnersCount = this.recentLuckymeStakes.filter(i => i.status.toLowerCase() == "won").length;
      
    });
  }

  changeSelectedLuckyme(luckymeId: number) {
    this.selectedluckyme = this.luckymeService.getLuckyMeWithId(luckymeId);
    if(this.selectedluckyme.status == "won")
      this.canUserBePaid = true;
    else
      this.canUserBePaid = false;
    //Dont do a request for the user if it already exists
    if (!this.selectedluckyme.user) {
      this.usersService.getUser(this.selectedluckyme.userId).subscribe((user: User) => {
        this.selectedluckyme.user = user;
      });
    }

  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === "0");
    });
  }

  onLuckymeGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  luckmeSelectionChanged(event) {
    var selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length < 1)
      return;
    this.changeSelectedLuckyme(selectedData[0].id);
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

  closePaymentBox() {
    this.paymentBoxShown = false;
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

  showPaymentBox() {
    this.paymentBoxShown = true;
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
    if (value == "all") {
      this.recentLuckymeStakes = this.luckymeService.allLuckymes;
    }
    else {
      this.recentLuckymeStakes = this.luckymeService.allLuckymes.filter(i => i.status == this.filterText);
      if (value = "won")
        this.cboPartType.nativeElement.selectedIndex = 3;
    }

    console.log(this.cboPartType);
    this.changeMainHeaderText(this.usersTypeFilterText, this.filterText);
  }

  refresh() {
    this.luckymeService.getAllLuckyMes().then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText);
    });
  }

  getLuckymesByType(value) {
    this.usersTypeFilterText = value;
    this.luckymeService.getLuckymesByType(value).then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText);
    });
  }

  changeMainHeaderText(UserType, luckyMeType) {

    switch (UserType) {
      case "all":
        UserType = "All"
        break;
      case "0":
        UserType = "Original"
        break;
      case "2":
        UserType = "Dummy"
        break;
      default:
        UserType = null;
        break;
    }

    if (luckyMeType == "all") {
      this.mainHeaderText = `${UserType} LuckyMes`;
    }
    else if (luckyMeType == "paid") {
      this.mainHeaderText = `${UserType} Active LuckyMes`;
    }
    else if (luckyMeType == "lost") {
      this.mainHeaderText = `${UserType} Lost LuckyMes`;
    }
    else if (luckyMeType == "won") {
      this.mainHeaderText = `${UserType} UnPaid LuckyMe Winners`;
    }
    else if (luckyMeType == "complete") {
      this.mainHeaderText = `${UserType} Paid LuckyMes Winners `;
    }

  }

  payWinner(){
    if(!this.selectedluckyme){
      alert("No LuckyMe Investment Is Selected");
      return;
    }


    this.showPaymentBox();
  }

  makePayment(){
    
  }

}


