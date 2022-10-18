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
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { Payment } from 'src/models/payment';
import { PaymentService } from 'src/services/payment.service';

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
    { headerName: "Contribution(GHS)", field: "amount", sortable: true, filter: true, resizable: true },
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

  mainHeaderText = "Luckyme Contributions";
  paymentForm: FormGroup;
  canUserBePaid: boolean = false;


  isPaymentInputsDisabled = true;
  paymentRecordMessage: string;
  selectedLuckyMePaymentDetails: Payment = new Payment();
  isAddingPaymentRecord: boolean = false;

  constructor(public luckymeService: LuckymeService, public winnerSelectionService: WinnerSelectionService, private paymentService: PaymentService,
    public signalRService: SignalRService, private usersService: UsersService, private httpClient: HttpClient) {
    this.detailCellRenderer = 'myDetailCellRenderer';
    this.detailRowHeight = 170;
    this.frameworkComponents = { myDetailCellRenderer: DetailCellRendererComponent }
    this.paymentForm = new FormGroup({
      'amount': new FormControl(this.selectedLuckyMePaymentDetails.amount, [Validators.required]),
      'transactionId': new FormControl(this.selectedLuckyMePaymentDetails.transactionId, [Validators.required])
    })
  }

  ngOnInit() {
    this.luckymeService.getAllLuckyMes().then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.getUnpaidWinnersCount();
    });
  }

  getUnpaidWinnersCount() {
    this.luckymeService.getUnpaidWinnersCount().subscribe(
      response => this.unpdaidWinnersCount = response
    );
  }

  changeSelectedLuckyme(luckymeId: number) {
    this.selectedluckyme = this.luckymeService.getLuckyMeWithId(luckymeId);
    if (this.selectedluckyme.status == "won" || this.selectedluckyme.status == "completed")
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

  /**
   * Add a new payment record
   */
  addPaymentRecord() {
    this.paymentRecordMessage = null;
    this.paymentForm.get('amount').markAsTouched();
    this.paymentForm.get('transactionId').markAsTouched();
    let amount = this.paymentForm.get('amount').value;
    let transactionId = this.paymentForm.get('transactionId').value;

    if (!amount || !transactionId) {
      this.paymentRecordMessage = "Form contains invalid inputs";
      return;
    }
    this.isAddingPaymentRecord = true;

    this.paymentService.addPaymentRecord('luckyme', amount, transactionId, this.selectedluckyme.txRef).subscribe(
      (response: any) => {
        //console.log(response);
        this.paymentRecordMessage = response.message;
        this.isAddingPaymentRecord = false;
        this.isPaymentInputsDisabled = true;
        this.getUnpaidWinnersCount();
        this.showUnpaidWinners(false);

        //console.log(response);
      },
      xhr => {
        //console.log(xhr);
        this.paymentRecordMessage = xhr;
        this.isAddingPaymentRecord = false;
        
      }
    )
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

  /**
   * Filter luckymes based on status
   * @param value the Kind of luckymes to show base on their status
   * @param shouldResetSelectedLkm Indicates whether the selected lucky should be reset or not
   */
  filterStaker(value, shouldResetSelectedLkm = true) {
    this.filterText = value;
    if (value == "all") {
      this.recentLuckymeStakes = this.luckymeService.allLuckymes;
    }
    else {
      this.recentLuckymeStakes = this.luckymeService.allLuckymes.filter(i => i.status == this.filterText);
    }

    if (shouldResetSelectedLkm)
      this.selectedluckyme = null;

    this.changeMainHeaderText(this.usersTypeFilterText, this.filterText);
  }

  refresh() {
    this.luckymeService.getAllLuckyMes().then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText);
    });
  }

  /**
 * Initiate Filter luckymes based on status
 * @param value the Kind of luckymes to show base on their status
 */
  changeParticipantTypeByStatus(value) {
    this.filterStaker(value);
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

  /**
   * Change the use fetch parameters, gets users based on that parameters and filters out and shows won but unpaid users
   * @param shouldResetSelectedLkm Should the currently selected luckyme be discarded?
   */
  showUnpaidWinners(shouldResetSelectedLkm = true) {
    this.usersTypeFilterText = '0';
    this.filterText = "won";
    this.luckymeService.getLuckymesByType(this.usersTypeFilterText).then((value) => {
      this.recentLuckymeStakes = [...this.luckymeService.allLuckymes];
      this.filterStaker(this.filterText,shouldResetSelectedLkm);
    });

  }

  getPaymentRecord() {
    if (this.selectedluckyme.status == "completed") {
      this.paymentService.getPaymentByDetails("luckyme", this.selectedluckyme.id).subscribe(
        response => {
          console.log(response);
          if (response) {
            this.selectedLuckyMePaymentDetails = response;
          }
          this.selectedLuckyMePaymentDetails.amount = this.selectedluckyme.amountToWin;

          this.paymentForm.get('amount').setValue(this.selectedLuckyMePaymentDetails.amount);
          this.paymentForm.get('transactionId').setValue(this.selectedLuckyMePaymentDetails.transactionId);
        }
      )
    } else {
      this.selectedLuckyMePaymentDetails = new Payment();
      this.paymentForm.get('amount').setValue(this.selectedLuckyMePaymentDetails.amount);
      this.paymentForm.get('transactionId').setValue(this.selectedLuckyMePaymentDetails.transactionId);
    }

  }

  payWinner() {
    if (!this.selectedluckyme) {
      alert("No LuckyMe Contribution Is Selected");
      return;
    }
    this.getPaymentRecord();
    this.showPaymentBox();
  }

}


