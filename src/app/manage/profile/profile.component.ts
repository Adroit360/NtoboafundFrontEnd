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
  constructor(private authService: AuthService, private userDashboardService: UserDashBoardService) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.apiPath = settings.currentApiUrl;
    this.registrationForm = new FormGroup({
      'firstName': new FormControl(this.currentUser.firstName, Validators.required),
      'lastName': new FormControl(this.currentUser.lastName, Validators.required),
      'email': new FormControl(this.currentUser.email, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(this.currentUser.phoneNumber, Validators.required),

    })
    this.cPasswordForm = new FormGroup({
      'password': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)
    });
    this.userDashboardService.headerText = "Profile";
    this.changeMode(false);

  }

  updateProfile() {
    this.loading = true;
    this.error = null;
    if (this.registrationForm.valid) {
      var formData = new FormData();
      formData.append('id', this.authService.currentUser.id.toString())
      formData.append('images', this.selectedImages)
      formData.append('firstName', this.registrationForm.value["firstName"])
      formData.append('lastName', this.registrationForm.value["lastName"])
      formData.append('email', this.registrationForm.value["email"])
      formData.append('phoneNumber', this.registrationForm.value["phoneNumber"])
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
