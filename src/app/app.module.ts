import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { HeaderComponent } from './header/header.component';
import { LuckymeComponent } from './luckyme/luckyme.component';
import { ReactiveFormsModule, FormsModule }    from '@angular/forms';
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
import { SignalRService } from 'src/services/signalr.service';
import { WinnerSelectionService } from 'src/services/winnerselection.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdhomeComponent } from './admin-dashboard/adhome/adhome.component';
import { AdusersComponent } from './admin-dashboard/adusers/adusers.component';
import { AdluckymesComponent } from './admin-dashboard/adluckymes/adluckymes.component';
import { AdbusinessesComponent } from './admin-dashboard/adbusinesses/adbusinesses.component';
import { AdsettingsComponent } from './admin-dashboard/adsettings/adsettings.component';
import { ScholarshipService } from 'src/services/scholarships.service';
import { LuckymeService } from 'src/services/luckyme.service';
import { BusinessService } from 'src/services/businesses.service';
import { UsersService } from 'src/services/users.service';
import { AdScholarshipsComponent } from './admin-dashboard/adscholarship/adscholarship.component';
import { PaymentService } from 'src/services/payment.service';
import { AnalysisService } from 'src/services/analysis.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ResetpasswordformComponent } from './resetpasswordform/resetpasswordform.component';
import { CommonModule } from '@angular/common';
import { AgGridModule } from '@ag-grid-community/angular';
import { DetailCellRendererComponent } from './cellrenderers/detail-cell-renderer/detail-cell-renderer.component'
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { WebmailComponent } from './webmail/webmail.component';
import { BlogComponent } from './blog/blog.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { SlidePanelComponent } from './shared/slide-panel/slide-panel.component';
import { SharedModule } from './shared/shared.module';
//import {CarouselModule} from "angular2-carousel";

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
    BusinessComponent,
    AdminDashboardComponent,
    AdhomeComponent,
    AdusersComponent,
    AdluckymesComponent,
    AdScholarshipsComponent,
    AdbusinessesComponent,
    AdsettingsComponent,
    ResetpasswordComponent,
    ResetpasswordformComponent,
    DetailCellRendererComponent,
    PdfViewerComponent,
    PaymentDialogComponent,
    WebmailComponent,
    BlogComponent,
    FooterComponent,
    ContactComponent,
    HowitworksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    CommonModule,
    SharedModule,
    AgGridModule.withComponents([DetailCellRendererComponent]),
    PdfViewerModule
  ],
  exports:[
    ChartsModule
  ],
  providers: [  
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FaqService,
    UserDashBoardService,
    CountDownService,
    SignalRService,
    WinnerSelectionService,
    LuckymeService,
    BusinessService,
    ScholarshipService,
    UsersService,
    PaymentService,
    AnalysisService
    
    
],
  bootstrap: [AppComponent]
})
export class AppModule { }
