import { Component, OnInit } from "@angular/core";
import { CrowdFundService } from "src/services/crowdFund.service";

@Component({
  selector: "app-crowdfunding",
  templateUrl: "./crowdfunding.component.html",
  styleUrls: ["./crowdfunding.component.scss"],
})
export class CrowdfundingComponent implements OnInit {
  crowdFund: any;
  urlLink = "https://ntoboafundwebapi.azurewebsites.net";

  constructor(private crowdService: CrowdFundService) {}

  ngOnInit() {
    this.crowdService.getCrowd("crowdfund/all/3/0/").subscribe((res) => {
      this.crowdFund = res;
    });
  }
}
