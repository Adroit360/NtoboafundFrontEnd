import { Component, OnInit } from "@angular/core";
import { CrowdFundService } from "src/services/crowdFund.service";

@Component({
  selector: "app-crowds",
  templateUrl: "./crowds.component.html",
  styleUrls: ["./crowds.component.scss"],
})
export class CrowdsComponent implements OnInit {
  crowds: any;
  urlLink = "https://ntoboafundwebapi.azurewebsites.net";

  constructor(private crowdService: CrowdFundService) {}

  ngOnInit() {
    this.crowdService.getCrowd("crowdfund/all/12/0/").subscribe((res) => {
      this.crowds = res;
    });
  }
}
