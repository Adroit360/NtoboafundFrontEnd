import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BusinessService } from "src/services/businesses.service";
import { WinnerSelectionService } from "src/services/winnerselection.service";
import { SignalRService } from "src/services/signalr.service";
import { Business } from "src/models/business";
import { UsersService } from "src/services/users.service";
import { User } from "src/models/user";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { DetailCellRendererComponent } from "src/app/cellrenderers/detail-cell-renderer/detail-cell-renderer.component";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { settings } from "src/settings";
import { Payment } from "src/models/payment";
import { PaymentService } from "src/services/payment.service";

@Component({
  selector: "app-adbusinesses",
  templateUrl: "./adbusinesses.component.html",
  styleUrls: ["./adbusinesses.component.scss"],
})
export class AdbusinessesComponent implements OnInit {
  @ViewChild("cboPartType") cboPartType: ElementRef;
  selectedbusiness: Business;

  //selectedWinnerToFix : Business;

  selectedFixerPeriod: string;

  fixerBoxShown: boolean = false;
  paymentBoxShown: boolean = false;

  recentBusinessStakes: Business[];

  usersTypeFilterText = "all";
  filterText: string = "all";

  participantsToFix: any[];

  unpdaidWinnersCount: number;

  gridApi: any;
  // checkboxSelection: true,
  businessColumnDefs = [
    { headerName: "Period", field: "period", sortable: true, filter: true, resizable: true, cellRenderer: "agGroupCellRenderer" },
    { headerName: "Date", field: "date", sortable: true, filter: true, resizable: true },
    { headerName: "Contribution(GHS)", field: "amount", sortable: true, filter: true, resizable: true },
    { headerName: "Status", field: "status", sortable: true, filter: true, resizable: true },
    { headerName: "AmountToWin", field: "amountToWin", sortable: true, filter: true, resizable: true },
    { headerName: "DrawDate", field: "dateDeclared", sortable: true, filter: true, resizable: true },
    {
      headerName: "Period",
      field: "period",
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Contribution(GHS)",
      field: "amount",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "AmountToWin",
      field: "amountToWin",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "DrawDate",
      field: "dateDeclared",
      sortable: true,
      filter: true,
      resizable: true,
    },
  ];
  businessModule = AllModules;
  gridColumnApi: any;
  detailCellRenderer: any;
  detailRowHeight: number;
  groupDefaultExpanded: number;
  frameworkComponents: {
    myDetailCellRenderer: typeof DetailCellRendererComponent;
  };

  mainHeaderText = "Business Contributions";
  paymentForm: FormGroup;
  canUserBePaid: boolean = false;

  isPaymentInputsDisabled = true;
  paymentRecordMessage: string;
  selectedBusinessPaymentDetails: Payment = new Payment();
  isAddingPaymentRecord: boolean = false;

  constructor(
    public businessService: BusinessService,
    public winnerSelectionService: WinnerSelectionService,
    private paymentService: PaymentService,
    public signalRService: SignalRService,
    private usersService: UsersService,
    private httpClient: HttpClient
  ) {
    this.detailCellRenderer = "myDetailCellRenderer";
    this.detailRowHeight = 170;
    this.frameworkComponents = {
      myDetailCellRenderer: DetailCellRendererComponent,
    };
    this.paymentForm = new FormGroup({
      amount: new FormControl(this.selectedBusinessPaymentDetails.amount, [
        Validators.required,
      ]),
      transactionId: new FormControl(
        this.selectedBusinessPaymentDetails.transactionId,
        [Validators.required]
      ),
    });
  }

  ngOnInit() {
    this.businessService.getAllBusinesses().then((value) => {
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
      this.getUnpaidWinnersCount();
    });
  }

  getUnpaidWinnersCount() {
    this.businessService
      .getUnpaidWinnersCount()
      .subscribe((response) => (this.unpdaidWinnersCount = response));
  }

  changeSelectedBusiness(businessId: number) {
    this.selectedbusiness = this.businessService.getBusinessWithId(businessId);
    if (
      this.selectedbusiness.status == "won" ||
      this.selectedbusiness.status == "completed"
    )
      this.canUserBePaid = true;
    else this.canUserBePaid = false;
    //Dont do a request for the user if it already exists
    if (!this.selectedbusiness.user) {
      this.usersService
        .getUser(this.selectedbusiness.userId)
        .subscribe((user: User) => {
          this.selectedbusiness.user = user;
        });
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === "0");
    });
  }

  onBusinessGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  luckmeSelectionChanged(event) {
    var selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length < 1) return;
    this.changeSelectedBusiness(selectedData[0].id);
  }

  /**
   * Add a new payment record
   */
  addPaymentRecord() {
    this.paymentRecordMessage = null;
    this.paymentForm.get("amount").markAsTouched();
    this.paymentForm.get("transactionId").markAsTouched();
    let amount = this.paymentForm.get("amount").value;
    let transactionId = this.paymentForm.get("transactionId").value;

    if (!amount || !transactionId) {
      this.paymentRecordMessage = "Form contains invalid inputs";
      return;
    }
    this.isAddingPaymentRecord = true;

    this.paymentService
      .addPaymentRecord(
        "bus",
        amount,
        transactionId,
        this.selectedbusiness.transferId
      )
      .subscribe(
        (response: any) => {
          this.paymentRecordMessage = response.message;
          this.isAddingPaymentRecord = false;
          this.isPaymentInputsDisabled = true;
          this.getUnpaidWinnersCount();
          this.showUnpaidWinners(false);
          console.log(response);
        },
        (xhr) => {
          this.paymentRecordMessage = xhr.error;
          this.isAddingPaymentRecord = false;
        }
      );
  }

  // changeFixedDailyBusiness(businessId: number) {
  //   this.selectedWinnerToFix = this.businessService.getBusinessWithId(businessId);

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

    this.participantsToFix = this.signalRService.businessParticipants;
  }

  showPaymentBox() {
    this.paymentBoxShown = true;
  }

  insertDummy(period: string) {
    if (confirm("Are you sure you want a new dummy staker fixed ?"))
      this.signalRService.addDummy("business", period);
  }

  fixWinner(winnerId: number) {
    this.signalRService.fixWinner(
      "business",
      this.selectedFixerPeriod,
      winnerId
    );

    this.winnerSelectionService.setFixedWinner(
      winnerId,
      this.participantsToFix
    );
  }

  unFixWinner(winnerId: number) {
    this.signalRService.unfixWinner(
      "business",
      this.selectedFixerPeriod,
      winnerId
    );
    this.winnerSelectionService.setUnfixedWinner(
      winnerId,
      this.participantsToFix
    );
  }

  /**
   * Filter businesses based on status
   * @param value the Kind of businesses to show base on their status
   * @param shouldResetSelectedLkm Indicates whether the selected lucky should be reset or not
   */
  filterStaker(value, shouldResetSelectedLkm = true) {
    this.filterText = value;
    if (value == "all") {
      this.recentBusinessStakes = this.businessService.allBusinesses;
    } else {
      this.recentBusinessStakes = this.businessService.allBusinesses.filter(
        (i) => i.status == this.filterText
      );
    }

    if (shouldResetSelectedLkm) this.selectedbusiness = null;

    this.changeMainHeaderText(this.usersTypeFilterText, this.filterText);
  }

  refresh() {
    this.businessService.getAllBusinesses().then((value) => {
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
      this.filterStaker(this.filterText);
    });
  }

  /**
   * Initiate Filter businesses based on status
   * @param value the Kind of businesses to show base on their status
   */
  changeParticipantTypeByStatus(value) {
    this.filterStaker(value);
  }

  getBusinessesByType(value) {
    this.usersTypeFilterText = value;
    this.businessService.getBusinessesByType(value).then((value) => {
      this.recentBusinessStakes = [...this.businessService.allBusinesses];
      this.filterStaker(this.filterText);
    });
  }

  changeMainHeaderText(UserType, businessType) {
    switch (UserType) {
      case "all":
        UserType = "All";
        break;
      case "0":
        UserType = "Original";
        break;
      case "2":
        UserType = "Dummy";
        break;
      default:
        UserType = null;
        break;
    }

    if (businessType == "all") {
      this.mainHeaderText = `${UserType} Businesses`;
    } else if (businessType == "paid") {
      this.mainHeaderText = `${UserType} Active Businesses`;
    } else if (businessType == "lost") {
      this.mainHeaderText = `${UserType} Lost Businesses`;
    } else if (businessType == "won") {
      this.mainHeaderText = `${UserType} UnPaid Business Winners`;
    } else if (businessType == "complete") {
      this.mainHeaderText = `${UserType} Paid Businesses Winners `;
    }
  }

  /**
   * Change the use fetch parameters, gets users based on that parameters and filters out and shows won but unpaid users
   * @param shouldResetSelectedLkm Should the currently selected business be discarded?
   */
  showUnpaidWinners(shouldResetSelectedLkm = true) {
    this.usersTypeFilterText = "0";
    this.filterText = "won";
    this.businessService
      .getBusinessesByType(this.usersTypeFilterText)
      .then((value) => {
        this.recentBusinessStakes = [...this.businessService.allBusinesses];
        this.filterStaker(this.filterText, shouldResetSelectedLkm);
      });
  }

  getPaymentRecord() {
    if (this.selectedbusiness.status == "completed") {
      this.paymentService
        .getPaymentByDetails("bus", this.selectedbusiness.id)
        .subscribe((response) => {
          console.log(response);
          if (response) {
            this.selectedBusinessPaymentDetails = response;
          }
          this.selectedBusinessPaymentDetails.amount =
            this.selectedbusiness.amountToWin;

          this.paymentForm
            .get("amount")
            .setValue(this.selectedBusinessPaymentDetails.amount);
          this.paymentForm
            .get("transactionId")
            .setValue(this.selectedBusinessPaymentDetails.transactionId);
        });
    } else {
      this.selectedBusinessPaymentDetails = new Payment();
      this.paymentForm
        .get("amount")
        .setValue(this.selectedBusinessPaymentDetails.amount);
      this.paymentForm
        .get("transactionId")
        .setValue(this.selectedBusinessPaymentDetails.transactionId);
    }
  }

  payWinner() {
    if (!this.selectedbusiness) {
      alert("No Business Contribution Is Selected");
      return;
    }
    this.getPaymentRecord();
    this.showPaymentBox();
  }
}
