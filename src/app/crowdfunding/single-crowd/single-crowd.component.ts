import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/services/authservice";
import { CrowdFundService } from "src/services/crowdFund.service";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PaymentService } from "src/services/payment.service";
import { settings } from "src/settings";
import { HttpClient } from "@angular/common/http";
import { Donation } from "src/models/donation";
import { MatBottomSheet } from "@angular/material";

@Component({
  selector: "app-single-crowd",
  templateUrl: "./single-crowd.component.html",
  styleUrls: ["./single-crowd.component.scss"],
})
export class SingleCrowdComponent implements OnInit {
  crowdID: any;
  crowdFund: any;

  urlLink = "https://ntoboafundwebapi.azurewebsites.net";

  userId: any;
  // pathUrl = this.router.url;
  pathUrl = window.location.href;
  loading = false;
  raveOptions: any;
  customPaymentDialogShown: boolean;
  congratMsg: string;
  congratShown: boolean;
  amount: number = 20;

  showAmount: Boolean = false;
  contributedList: any;

  todayDate = new Date();
  endDate: Date;
  leftDate: any;

  groupedContributed = {};
  groupedKeys;
  constructor(
    private route: ActivatedRoute,
    private crowdService: CrowdFundService,
    public authService: AuthService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private location: Location,
    private snackbar: MatSnackBar,
    private paymentService: PaymentService,
    private http: HttpClient,
    private btSheet: MatBottomSheet
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.crowdID = res["id"];
      this.getCrowdFund();
      this.getContributionList();
    });

    this.getUser();

    this.setRaveOptions();
  }

  paymentInitialized() {
    // this.customPaymentDialogShown = true;
    // return;
    if (this.authService.isAuthenticated) {
      // if (!this.selectedChoice) {
      //   this.error = "Please Select a Choice";
      //   this.errorShown = true;
      //   return;
      // }

      if (this.authService.hasPaymentDetails(`${this.amount}`, true)) {
        this.loading = true;
        this.setRaveOptions();
        this.http
          .post<any>(
            `${settings.currentApiUrl}/api/crowdfund/donate`,
            new Donation({
              amount: this.amount,
              userId: this.authService.currentUser.id,
              txRef: this.raveOptions.txref,
              crowdfundId: this.crowdFund.id,
              paid: false,
            })
          )
          .subscribe(
            (response) => {
              this.loading = false;
              console.log(response);

              if (
                settings.paymentGateway == "slydepay" ||
                settings.paymentGateway == "redde" || 
                settings.paymentGateway == "theTeller"
              ) {
                this.customPaymentDialogShown = true;
              }
            },
            (error) => {
              this.loading = false;
              console.log(error);
            }
          );
      }
    } else {
      this.router.navigate(["login"]);
    }
  }

  setRaveOptions() {
    this.raveOptions = this.paymentService.getRaveOptions(
      "CrowdFund",
      this.amount,
      this.amount && this.authService.hasPaymentDetails(`${this.amount}`)
    );
  }

  getCrowdFund() {
    this.crowdService.singleCrowd(this.crowdID).subscribe(
      (res) => {
        this.crowdFund = res;
        this.endDate = this.crowdFund.endDate;
        var timeLeft =
          new Date(this.endDate).getTime() - this.todayDate.getTime();
        this.leftDate = timeLeft / (1000 * 3600 * 24);
      },
      (err) => {
        this.location.back();
      }
    );
  }

  getContributionList() {
    this.crowdService.getPeopleContribution(this.crowdID).subscribe((res) => {
      this.contributedList = res;
      this.groupedContributed = [];
      (<Array<any>>res).forEach((item) => {
        if (!this.groupedContributed[item.username])
          this.groupedContributed[item.username] = [];
        this.groupedContributed[item.username].push(item);
      });
      this.groupedKeys = Object.keys(this.groupedContributed);
      console.log(this.groupedContributed);
    });
  }

  async getUser() {
    const userid = await this.authService.currentUser;
    this.userId = userid.id;
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    this.modalService.dismissAll();
    this.snackbar.open("Link Copied", "OK", {
      duration: 3000,
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  deleteCrowdFund() {
    this.crowdService.deleteCrowd(this.crowdID).subscribe(
      (res) => {
        this.router.navigate(["/crowds"]);
        this.snackbar.open("Crowdfund successfully deleted", "OK", {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "center",
        });
        this.modalService.dismissAll();
      },
      (err) => {
        console.log(err);

        this.snackbar.open(err.error.message, "Retry", {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "center",
        });
        this.modalService.dismissAll();
      }
    );
  }

  showCongratulatoryMessage(message: string) {
    this.congratMsg = message;
    this.congratShown = true;
  }

  closePaymentDialog() {
    this.customPaymentDialogShown = false;
  }
  showPayment() {
    this.showAmount = !this.showAmount;
    console.log("show");
  }
}
