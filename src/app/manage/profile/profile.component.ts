import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';
import { UserDashBoardService } from 'src/services/userdashbord.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = false;
  error = null;
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
  constructor(private authService: AuthService, private userDashboardService: UserDashBoardService) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.apiPath = settings.currentApiUrl;
    console.log(this.currentUser);
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
      'password': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)
    });
    this.userDashboardService.headerText = "Profile";
    this.changeMode(false);

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
          console.log("User Updated Successfull");

          if (user) {
            var userToken = this.authService.currentUser.token;
            user.token = userToken;
            console.log(user)
            localStorage.setItem('currentUser', JSON.stringify(user));
            //reset the current user
            this.currentUser = this.authService.currentUser;
          }
          this.loading = false;
          this.changeMode(false);
          this.showMessage("User Profile Updated Successfully");
        },
        error => {
          this.showMessage("User Profile Update Failed");
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
    console.log(event);

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

      console.log(this.momoCurrency);
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
      this.page = "view";
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
}
