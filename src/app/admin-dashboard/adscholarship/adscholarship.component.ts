import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScholarshipService } from 'src/services/scholarships.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { SignalRService } from 'src/services/signalr.service';
import { Scholarship } from 'src/models/scholarship';
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
  selector: 'app-adscholarship',
  templateUrl: './adscholarship.component.html',
  styleUrls: ['./adscholarship.component.scss']
})
export class AdScholarshipsComponent implements OnInit {

  @ViewChild("cboPartType") cboPartType: ElementRef;
  selectedscholarship: Scholarship;

  //selectedWinnerToFix : Scholarship;

  selectedFixerPeriod: string;

  fixerBoxShown: boolean = false;
  paymentBoxShown: boolean = false;

  recentScholarshipStakes: Scholarship[];

  usersTypeFilterText = "all";
  filterText: string = "all";

  participantsToFix: any[];

  unpdaidWinnersCount: number;

  gridApi: any;
  // checkboxSelection: true,
  scholarshipColumnDefs = [
    { headerName: "Period", field: "period", sortable: true, filter: true, resizable: true, cellRenderer: "agGroupCellRenderer" },
    { headerName: "Date", field: "date", sortable: true, filter: true, resizable: true },
    { headerName: "Contribution(GHS)", field: "amount", sortable: true, filter: true, resizable: true },
    { headerName: "Status", field: "status", sortable: true, filter: true, resizable: true },
    { headerName: "AmountToWin", field: "amountToWin", sortable: true, filter: true, resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true, resizable: true }
  ];
  scholarshipModule = AllModules;
  gridColumnApi: any;
  detailCellRenderer: any;
  detailRowHeight: number;
  groupDefaultExpanded: number;
  frameworkComponents: { myDetailCellRenderer: typeof DetailCellRendererComponent; };

  mainHeaderText = "Scholarship Contributions";
  paymentForm: FormGroup;
  canUserBePaid: boolean = false;


  isPaymentInputsDisabled = true;
  paymentRecordMessage: string;
  selectedScholarshipPaymentDetails: Payment = new Payment();
  isAddingPaymentRecord: boolean = false;

  constructor(public scholarshipService: ScholarshipService, public winnerSelectionService: WinnerSelectionService, private paymentService: PaymentService,
    public signalRService: SignalRService, private usersService: UsersService, private httpClient: HttpClient) {
    this.detailCellRenderer = 'myDetailCellRenderer';
    this.detailRowHeight = 170;
    this.frameworkComponents = { myDetailCellRenderer: DetailCellRendererComponent }
    this.paymentForm = new FormGroup({
      'amount': new FormControl(this.selectedScholarshipPaymentDetails.amount, [Validators.required]),
      'transactionId': new FormControl(this.selectedScholarshipPaymentDetails.transactionId, [Validators.required])
    })
  }

  ngOnInit() {
    this.scholarshipService.getAllScholarships().then((value) => {
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.getUnpaidWinnersCount();
    });
  }

  getUnpaidWinnersCount() {
    this.scholarshipService.getUnpaidWinnersCount().subscribe(
      response => this.unpdaidWinnersCount = response
    );
  }

  changeSelectedScholarship(scholarshipId: number) {
    this.selectedscholarship = this.scholarshipService.getScholarshipWithId(scholarshipId);
    if (this.selectedscholarship.status == "won" || this.selectedscholarship.status == "completed")
      this.canUserBePaid = true;
    else
      this.canUserBePaid = false;
    //Dont do a request for the user if it already exists
    if (!this.selectedscholarship.user) {
      this.usersService.getUser(this.selectedscholarship.userId).subscribe((user: User) => {
        this.selectedscholarship.user = user;
      });
    }

  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === "0");
    });
  }

  onScholarshipGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  scholarshipSelectionChanged(event) {
    var selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length < 1)
      return;
    this.changeSelectedScholarship(selectedData[0].id);
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

    this.paymentService.addPaymentRecord('bus', amount, transactionId, this.selectedscholarship.transferId).subscribe(
      (response: any) => {
        this.paymentRecordMessage = response.message;
        this.isAddingPaymentRecord = false;
        this.isPaymentInputsDisabled = true;
        this.getUnpaidWinnersCount();
        this.showUnpaidWinners(false);
        console.log(response);
      },
      xhr => {
        this.paymentRecordMessage = xhr.error;
        this.isAddingPaymentRecord = false;
      }
    )
  }



  // changeFixedDailyScholarship(scholarshipId: number) {
  //   this.selectedWinnerToFix = this.scholarshipService.getScholarshipWithId(scholarshipId);


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

    this.participantsToFix = this.signalRService.scholarshipParticipants;
  }

  showPaymentBox() {
    this.paymentBoxShown = true;
  }

  insertDummy(period: string) {
    if (confirm("Are you sure you want a new dummy staker fixed ?"))
      this.signalRService.addDummy("scholarship", period);
  }

  fixWinner(winnerId: number) {
    this.signalRService.fixWinner('scholarship', this.selectedFixerPeriod, winnerId);

    this.winnerSelectionService.setFixedWinner(winnerId, this.participantsToFix);
  }

  unFixWinner(winnerId: number) {
    this.signalRService.unfixWinner('scholarship', this.selectedFixerPeriod, winnerId);
    this.winnerSelectionService.setUnfixedWinner(winnerId, this.participantsToFix);

  }

  /**
   * Filter scholarships based on status
   * @param value the Kind of scholarships to show base on their status
   * @param shouldResetSelectedLkm Indicates whether the selected lucky should be reset or not
   */
  filterStaker(value, shouldResetSelectedLkm = true) {
    this.filterText = value;
    if (value == "all") {
      this.recentScholarshipStakes = this.scholarshipService.allScholarships;
    }
    else {
      this.recentScholarshipStakes = this.scholarshipService.allScholarships.filter(i => i.status == this.filterText);
    }

    if (shouldResetSelectedLkm)
      this.selectedscholarship = null;

    this.changeMainHeaderText(this.usersTypeFilterText, this.filterText);
  }

  refresh() {
    this.scholarshipService.getAllScholarships().then((value) => {
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.filterStaker(this.filterText);
    });
  }

  /**
 * Initiate Filter scholarships based on status
 * @param value the Kind of scholarships to show base on their status
 */
  changeParticipantTypeByStatus(value) {
    this.filterStaker(value);
  }

  getScholarshipsByType(value) {
    this.usersTypeFilterText = value;
    this.scholarshipService.getScholarshipsByType(value).then((value) => {
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.filterStaker(this.filterText);
    });
  }

  changeMainHeaderText(UserType, scholarshipType) {

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

    if (scholarshipType == "all") {
      this.mainHeaderText = `${UserType} Scholarships`;
    }
    else if (scholarshipType == "paid") {
      this.mainHeaderText = `${UserType} Active Scholarships`;
    }
    else if (scholarshipType == "lost") {
      this.mainHeaderText = `${UserType} Lost Scholarships`;
    }
    else if (scholarshipType == "won") {
      this.mainHeaderText = `${UserType} UnPaid Scholarship Winners`;
    }
    else if (scholarshipType == "complete") {
      this.mainHeaderText = `${UserType} Paid Scholarships Winners `;
    }

  }

  /**
   * Change the use fetch parameters, gets users based on that parameters and filters out and shows won but unpaid users
   * @param shouldResetSelectedLkm Should the currently selected scholarship be discarded?
   */
  showUnpaidWinners(shouldResetSelectedLkm = true) {
    this.usersTypeFilterText = '0';
    this.filterText = "won";
    this.scholarshipService.getScholarshipsByType(this.usersTypeFilterText).then((value) => {
      this.recentScholarshipStakes = [...this.scholarshipService.allScholarships];
      this.filterStaker(this.filterText,shouldResetSelectedLkm);
    });

  }

  getPaymentRecord() {
    if (this.selectedscholarship.status == "completed") {
      this.paymentService.getPaymentByDetails("sch", this.selectedscholarship.id).subscribe(
        response => {
          console.log(response);
          if (response) {
            this.selectedScholarshipPaymentDetails = response;
          }
          this.selectedScholarshipPaymentDetails.amount = this.selectedscholarship.amountToWin;

          this.paymentForm.get('amount').setValue(this.selectedScholarshipPaymentDetails.amount);
          this.paymentForm.get('transactionId').setValue(this.selectedScholarshipPaymentDetails.transactionId);
        }
      )
    } else {
      this.selectedScholarshipPaymentDetails = new Payment();
      this.paymentForm.get('amount').setValue(this.selectedScholarshipPaymentDetails.amount);
      this.paymentForm.get('transactionId').setValue(this.selectedScholarshipPaymentDetails.transactionId);
    }

  }

  payWinner() {
    if (!this.selectedscholarship) {
      alert("No Scholarship Contribution Is Selected");
      return;
    }
    this.getPaymentRecord();
    this.showPaymentBox();
  }

}


