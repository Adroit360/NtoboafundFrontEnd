import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { formatDate } from '@angular/common';
import { Payment } from 'src/models/payment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = false;
  error = null;
  changePasswordError = null;
  selectedImages: any;
  registrationForm: FormGroup;
  cPasswordForm: FormGroup;
  apiPath: any;
  currentUser: any;
  page: string;
  isEditMode: boolean;
  mode: string;
  isMessageShown: boolean;
  message: string;
  networks: String[];
  
  momoCurrency:string;
  returnUrl:string;
  cpdbtnSubmitShown: boolean = true;
  
  @ViewChild("rdopasswordtoggler") passwordToggler:ElementRef;

  constructor(private authService: AuthService, 
    private userDashboardService: UserDashBoardService,
    private router:Router,private httpClient:HttpClient,
    private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.apiPath = settings.currentApiUrl;
  
    this.returnUrl = this.activatedRoute.snapshot.queryParams["returnUrl"];
    
    this.momoCurrency = this.currentUser.momoDetails.currency;

    this.registrationForm = new FormGroup({
      'firstName': new FormControl(this.currentUser.firstName, Validators.required),
      'lastName': new FormControl(this.currentUser.lastName, Validators.required),
      'email': new FormControl(this.currentUser.email, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(this.currentUser.phoneNumber, Validators.required),

      'country':new FormControl(this.currentUser.momoDetails.country),
      'mobileMoneyNumber':new FormControl(this.currentUser.momoDetails.number),
      'network' : new FormControl(this.currentUser.momoDetails.network),

      'bankName':new FormControl(this.currentUser.bankDetails.bankName),
      'accountNumber':new FormControl(this.currentUser.bankDetails.accountNumber),
      'swiftCode':new FormControl(this.currentUser.bankDetails.swiftCode),

      'preferredReceptionMethod':new FormControl(this.currentUser.preferedMoneyReceptionMethod)


    })
    this.cPasswordForm = new FormGroup({
      'currentPassword':new FormControl(null,Validators.required),
      'newPassword': new FormControl(null, Validators.required),
      'confirmNewPassword': new FormControl(null, Validators.required)
    });
    this.userDashboardService.headerText = "Profile";
    this.changeMode(true);

    this.networks = []
  }

  updateProfile() {
    this.loading = true;
    this.error = null;
    
    //console.log(this.registrationForm);
    if (this.registrationForm.valid) {
      var formData = new FormData();
      formData.append('id', this.authService.currentUser.id.toString());
     // formData.append('images', this.selectedImages);
      formData.append('firstName', this.registrationForm.value["firstName"]);
      formData.append('lastName', this.registrationForm.value["lastName"]);
      formData.append('email', this.registrationForm.value["email"]);
      formData.append('phoneNumber', this.registrationForm.value["phoneNumber"]);
      formData.append('country',this.registrationForm.value['country']);
      formData.append('mobileMoneyNumber',this.registrationForm.value['mobileMoneyNumber']);
      formData.append('network',this.registrationForm.value['network']);
      formData.append('currency',this.momoCurrency);
      formData.append('bankName',this.registrationForm.value['bankName']);
      formData.append('accountNumber',this.registrationForm.value['accountNumber']);
      formData.append('swiftCode',this.registrationForm.value['swiftCode']);
      formData.append('preferredReceptionMethod',this.registrationForm.value['preferredReceptionMethod']);
      this.authService.updateUser(
        formData
      ).subscribe(
        user => {
          //console.log("User Updated Successfull");

          if (user) {
            var userToken = this.authService.currentUser.token;
            user.token = userToken;
            //console.log(user)
            localStorage.setItem('currentUser', JSON.stringify(user));
            //reset the current user
            this.currentUser = this.authService.currentUser;
          }
          this.loading = false;
         // this.changeMode(false);
          this.showMessage("User Profile Updated Successfully");
          setTimeout((() => {
            this.router.navigate([this.returnUrl]);
          }).bind(this), 1000);
        },
        error => {
          this.showMessage(error);
          this.error = error;
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      this.error = "Form Contains Invalid Fields";
    }
  }

  imageSelected(event) {
   // console.log(event);

    this.selectedImages = event.file;
  }

  countryChanged(event) {
    this.networks = [];
    var supportedNetworks: String = event.target.selectedOptions[0].dataset.networks;
    if (supportedNetworks.length > 0 && supportedNetworks.includes(','))
      this.networks = supportedNetworks.split(',');
     else if (supportedNetworks.length > 0)
      this.networks = [supportedNetworks]

      this.momoCurrency = event.target.selectedOptions[0].dataset.currency;

      //console.log(this.momoCurrency);
  }

  isSelected(page) {
    if (page == this.page)
      return true;
    return false;
  }

  /**
   * This method is used to set the currently checked radio button
   * @param page the current page
   */
  check(page) {
    this.page = page;
    if (page == "edit")
      this.changeMode(true);
    else
      this.changeMode(false);
  }

  /**
   * sets the profile page to edit mode or view mode
   * @param isEditMode is Profile Page in Edit Mode
   */
  changeMode(isEditMode) {
    this.isEditMode = isEditMode;
    if (isEditMode) {
      this.page = "edit"
      this.mode = "Edit Mode";
    }
    else {
      this.page = "edit";
      this.mode = "View Mode";
    }
  }

  showMessage(message) {
    this.message = message;
    this.isMessageShown = true;
    setTimeout(function () {
      this.isMessageShown = false;
    }.bind(this), 2000);
  }

  changePassword(){
    
    this.cpdbtnSubmitShown = false;
    
    var currentPassword = this.cPasswordForm.get("currentPassword").value;
    var newPassword = this.cPasswordForm.get("newPassword").value;
    var confirmNewPassword = this.cPasswordForm.get("confirmNewPassword").value;

    if(!this.cPasswordForm.valid){
      this.changePasswordError = "Please fill out all fields in the form";
      this.cpdbtnSubmitShown = true;
      return;
    }

    if(newPassword != confirmNewPassword){
      this.changePasswordError = "The new passwords do not match";
      this.cpdbtnSubmitShown = true;
      return;
    }

    var formData = new FormData();
    formData.append('userId', this.authService.currentUser.id.toString());
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', confirmNewPassword);

    this.httpClient.put(`${settings.currentApiUrl}/users/changepassword`,formData)
      .subscribe((response:any)=>{
        this.cpdbtnSubmitShown = true;
        this.passwordToggler.nativeElement.checked = false;
        this.cPasswordForm.reset();
        this.showMessage(response.message)
      },xhr=>{
          this.changePasswordError = xhr.error.message.description;
          this.cpdbtnSubmitShown = true;
      });
  }
}
