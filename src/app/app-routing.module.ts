import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login-component/login-component.component";
import { RegisterComponent } from "./register-component/register-component.component";
import { LuckymeComponent } from "./luckyme/luckyme.component";
import { TnxluckymeComponent } from "./tnxluckyme/tnxluckyme.component";
import { ManageComponent } from "./manage/manage.component";
import { MHomeComponent } from "./manage/home/home.component";
import { ProfileComponent } from "./manage/profile/profile.component";
import { ScholarshipComponent } from "./scholarship/scholarship.component";
import { BusinessComponent } from "./business/business.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdhomeComponent } from "./admin-dashboard/adhome/adhome.component";
import { AdusersComponent } from "./admin-dashboard/adusers/adusers.component";
import { AdluckymesComponent } from "./admin-dashboard/adluckymes/adluckymes.component";
import { AdsettingsComponent } from "./admin-dashboard/adsettings/adsettings.component";
import { AdbusinessesComponent } from "./admin-dashboard/adbusinesses/adbusinesses.component";
import { AdScholarshipsComponent } from "./admin-dashboard/adscholarship/adscholarship.component";
import { ResetpasswordComponent } from "./resetpassword/resetpassword.component";
import { ResetpasswordformComponent } from "./resetpasswordform/resetpasswordform.component";
import { PdfViewerComponent } from "./pdf-viewer/pdf-viewer.component";
import { PaymentDialogComponent } from "./payment-dialog/payment-dialog.component";
import { BlogComponent } from "./blog/blog.component";
import { WebmailComponent } from "./webmail/webmail.component";
import { CrowdfundingComponent } from "./crowdfunding/crowdfunding.component";
import { AddCrowdfundComponent } from "./crowdfunding/add-crowdfund/add-crowdfund.component";
import { SingleCrowdComponent } from "./crowdfunding/single-crowd/single-crowd.component";
import { AuthGuard } from "src/guards/auth.guard";
import { CrowdsComponent } from "./crowdfunding/crowds/crowds.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "crowdfunding", component: CrowdfundingComponent },
  {path:'crowds', component:CrowdsComponent},
  {
    path: "add-crowdfunding",
    component: AddCrowdfundComponent,
    canActivate: [AuthGuard],
  },
  { path: "crowdfunding/:id", component: SingleCrowdComponent },
  { path: "luckyme", component: LuckymeComponent },
  { path: "scholarship", component: ScholarshipComponent },
  { path: "business", component: BusinessComponent },
  { path: "insurance", component: InsuranceComponent },
  { path: "tnx", component: TnxluckymeComponent },
  {
    path: "manage",
    component: ManageComponent,
    children: [
      { path: "", component: MHomeComponent, pathMatch: "full" },
      { path: "overview", component: MHomeComponent },
      { path: "profile", component: ProfileComponent },
    ],
  },
  {
    path: "admin",
    component: AdminDashboardComponent,
    children: [
      { path: "", component: AdhomeComponent, pathMatch: "full" },
      { path: "overview", component: AdhomeComponent },
      { path: "adprofile", component: ProfileComponent },
      { path: "adusers", component: AdusersComponent },
      { path: "adluckymes", component: AdluckymesComponent },
      { path: "adscholarships", component: AdScholarshipsComponent },
      { path: "adbusinesses", component: AdbusinessesComponent },
      { path: "adsettings", component: AdsettingsComponent },
    ],
  },
  { path: "resetpassword", component: ResetpasswordComponent },
  { path: "resetpasswordform", component: ResetpasswordformComponent },
  { path: "terms", component: PdfViewerComponent },
  { path: "cookiepolicy", component: PdfViewerComponent },
  { path: "payment", component: PaymentDialogComponent },
  { path: "webmail", component: WebmailComponent },
  { path: "blog", component: BlogComponent },
  { path: "**", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
