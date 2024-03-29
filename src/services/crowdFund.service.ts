import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASEURL = "https://ntoboafundwebapi.azurewebsites.net/api/";

@Injectable({ providedIn: "root" })
export class CrowdFundService {
  constructor(private http: HttpClient) {}

  addCrowdFund(body) {
    return this.http.post(`${BASEURL}` + "crowdfund/add", body);
  }

  getCrowd(link) {
    return this.http.get(`${BASEURL}` + link);
  }

  singleCrowd(id) {
    return this.http.get(`${BASEURL}` + "crowdfund/single/" + `${id}`);
  }

  deleteCrowd(id) {
    return this.http.delete(`${BASEURL}` + "crowdfund/delete/" + `${id}`);
  }

  updateCrowd(body) {
    return this.http.put(`${BASEURL}` + "crowdfund/update", body);
  }

  getPeopleContribution(id) {
    return this.http.get(
      `${BASEURL}` + "crowdfund/donations/forfund/" + `${id}`
    );
  }
}
