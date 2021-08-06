import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ICrowd } from "src/models/crowdFund";

@Injectable({ providedIn: "root" })
export class CrowdFund {
  _url = "src/_data/crowd_fund_demo.json";

  constructor(private http: HttpClient) {}

  getCrowd(): Observable<ICrowd[]> {
    return this.http.get<ICrowd[]>("src/_data/crowd_fund_demo.json");
  }
}
