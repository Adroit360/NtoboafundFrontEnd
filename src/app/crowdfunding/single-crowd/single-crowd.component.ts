import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-single-crowd",
  templateUrl: "./single-crowd.component.html",
  styleUrls: ["./single-crowd.component.scss"],
})
export class SingleCrowdComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor() {}

  ngOnInit() {}
}
