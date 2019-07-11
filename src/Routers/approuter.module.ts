import {Routes, RouterModule} from "@angular/router";
import { NgModule } from "@angular/core";

const routes:Routes = [
    {path:"",component:HomeComponent},
    {path:"login",component:LoginComponent},
    {path:"signup",component:SignupComponent}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRouter{

}