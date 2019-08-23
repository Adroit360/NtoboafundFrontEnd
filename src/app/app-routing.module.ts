import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { LuckymeComponent } from './luckyme/luckyme.component';
import { TnxluckymeComponent } from './tnxluckyme/tnxluckyme.component';
import { ManageComponent } from './manage/manage.component';
import { MHomeComponent } from './manage/home/home.component';
import { ProfileComponent } from './manage/profile/profile.component';
import { ScholarshipComponent } from './scholarship/scholarship.component';
import { BusinessComponent } from './business/business.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdhomeComponent } from './admin-dashboard/adhome/adhome.component';
import { AdusersComponent } from './admin-dashboard/adusers/adusers.component';
import { AdluckymesComponent } from './admin-dashboard/adluckymes/adluckymes.component';
import { AdsettingsComponent } from './admin-dashboard/adsettings/adsettings.component';
import { AdbusinessesComponent } from './admin-dashboard/adbusinesses/adbusinesses.component';
import { AdScholarshipsComponent } from './admin-dashboard/adscholarship/adscholarship.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"luckyme",component:LuckymeComponent},
  {path:"scholarship",component:ScholarshipComponent},
  {path:"business",component:BusinessComponent},
  {path:"insurance",component:InsuranceComponent},
  {path:"tnxluckyme",component:TnxluckymeComponent},
  {path:"manage",component:ManageComponent,children:[
    {path:"",component:MHomeComponent,pathMatch:"full"},
    {path:"overview",component:MHomeComponent},
    {path:"profile",component:ProfileComponent}
  ]},
  {path:"admin",component:AdminDashboardComponent,children:[
    {path:"",component:AdhomeComponent,pathMatch:"full"},
    {path:"overview",component:AdhomeComponent},
    {path:"adprofile",component:ProfileComponent},
    {path:"adusers",component:AdusersComponent},
    {path:"adluckymes",component:AdluckymesComponent},
    {path:"adscholarships",component:AdScholarshipsComponent},
    {path:"adbusinesses",component:AdbusinessesComponent},
    {path:"adsettings",component:AdsettingsComponent}
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
