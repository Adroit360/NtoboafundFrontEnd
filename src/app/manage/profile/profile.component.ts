import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/authservice';
import { settings } from 'src/settings';

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
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.apiPath = settings.currentApiUrl;
    this.registrationForm = new FormGroup({
      'firstName': new FormControl(this.currentUser.firstName, Validators.required),
      'lastName': new FormControl(this.currentUser.lastName, Validators.required),
      'email': new FormControl(this.currentUser.email, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(this.currentUser.phoneNumber, Validators.required),
      'password': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)

    })
    this.cPasswordForm = new FormGroup({});
    console.log(this.registrationForm);
  }

  updateProfile() {
    this.loading = true;
    this.error = null;
    if (this.registrationForm.valid) {
      var formData = new FormData();
      formData.append('images', this.selectedImages)
      formData.append('firstName', this.registrationForm.value["firstName"])
      formData.append('lastName', this.registrationForm.value["lastName"])
      formData.append('email', this.registrationForm.value["email"])
      formData.append('phoneNumber', this.registrationForm.value["phoneNumber"])
      formData.append('password', this.registrationForm.value["password"])
      formData.append('confirmPassword', this.registrationForm.value["confirmPassword"])
      this.authService.register(
        formData
        /* this.selectedImages,
         this.registrationForm.value["firstName"],
         this.registrationForm.value["lastName"],
         this.registrationForm.value["email"],
         this.registrationForm.value["phoneNumber"],
         this.registrationForm.value["password"],
         this.registrationForm.value["confirmPassword"]*/
      ).subscribe(
        user => {
          console.log("Success");
          console.log(user)
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.loading = false;

        },
        error => {
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

  check(page) {
    this.page = page;
  }
}
