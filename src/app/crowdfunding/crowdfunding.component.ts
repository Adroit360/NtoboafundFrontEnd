import { Component, OnInit } from "@angular/core";
import { CrowdFund } from "src/services/crowdFund.service";

@Component({
  selector: "app-crowdfunding",
  templateUrl: "./crowdfunding.component.html",
  styleUrls: ["./crowdfunding.component.scss"],
})
export class CrowdfundingComponent implements OnInit {
  constructor(private crowdService: CrowdFund) {}

  crowdFund: any;

  ngOnInit() {
    this.getCrowdFund();
  }

  getCrowdFund() {
    this.crowdService.getCrowd().subscribe((response) => {
      this.crowdFund = response;
    });
  }
}
