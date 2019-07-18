import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { LuckymeComponent } from './luckyme/luckyme.component';
import { TnxluckymeComponent } from './tnxluckyme/tnxluckyme.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"luckyme/:checkoutId?",component:LuckymeComponent},
  {path:"tnxluckyme",component:TnxluckymeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
