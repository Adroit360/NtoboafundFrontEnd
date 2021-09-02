import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/services/authservice";
import { CrowdFundService } from "src/services/crowdFund.service";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  constructor(
    private route: ActivatedRoute,
    private crowdService: CrowdFundService,
    private authService: AuthService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private location: Location,
    private snackbar: MatSnackBar
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.crowdID = res["id"];
      this.getCrowdFund();
    });

    this.getUser();
  }

  getCrowdFund() {
    this.crowdService.singleCrowd(this.crowdID).subscribe(
      (res) => {
        this.crowdFund = res;
      },
      (err) => {
        this.location.back();
      }
    );
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
}
