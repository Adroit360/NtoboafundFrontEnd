import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { HeaderComponent } from './header/header.component';
import { LuckymeComponent } from './luckyme/luckyme.component';
import { ReactiveFormsModule }    from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from 'src/interceptors/error.interceptor';
import { JwtInterceptor } from 'src/interceptors/jwt.interceptor';
import { BusyComponent } from './busy/busy.component';
import { TnxluckymeComponent } from './tnxluckyme/tnxluckyme.component';
import { CustomFileInputComponent } from './custom-controls/custom-file-input/custom-file-input.component';
import { RotBorderComponent } from './custom-controls/rot-border/rot-border.component';
import { ManageComponent } from './manage/manage.component';
import { FaqComponent } from './faq/faq.component';
import { FaqService } from 'src/services/faqService';
import { ProfileComponent } from './manage/profile/profile.component';
import { MHomeComponent } from './manage/home/home.component';
import { ChartsModule } from 'ng2-charts';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { ScholarshipComponent } from './scholarship/scholarship.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { BusinessComponent } from './business/business.component';
import { CountDownService } from 'src/services/countdownservice';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    LuckymeComponent,
    BusyComponent,
    TnxluckymeComponent,
    CustomFileInputComponent,
    RotBorderComponent,
    ManageComponent,
    FaqComponent,
    ProfileComponent,
    MHomeComponent,
    ScholarshipComponent,
    InsuranceComponent,
    BusinessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  exports:[
    ChartsModule
  ],
  providers: [  
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FaqService,
    UserDashBoardService,
    CountDownService
    
],
  bootstrap: [AppComponent]
})
export class AppModule { }
