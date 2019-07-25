import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/authservice';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;
  loading = false;
  error = null;
  selectedImages;
  constructor(private authService: AuthService,private router:Router) { }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      'firstName': new FormControl(null,Validators.required),
      'lastName': new FormControl(null,Validators.required),
      'email': new FormControl(null,[Validators.required,Validators.email]),
      'phoneNumber': new FormControl(null,Validators.required),
      'password': new FormControl(null,Validators.required),
      'confirmPassword': new FormControl(null,Validators.required)
      
    })
    this.selectedImages = null;
  }

  register() {
    this.loading = true;
    this.error = null;
    if(this.registrationForm.valid){
      var formData = new FormData();
      formData.append('images',this.selectedImages)
      formData.append('firstName',this.registrationForm.value["firstName"])
      formData.append('lastName',this.registrationForm.value["lastName"])
      formData.append('email',this.registrationForm.value["email"])
      formData.append('phoneNumber',this.registrationForm.value["phoneNumber"])
      formData.append('password',this.registrationForm.value["password"])
      formData.append('confirmPassword',this.registrationForm.value["confirmPassword"])
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
            this.authService.isAuthenticated = true;
            this.router.navigate(['']);
          }
          this.loading = false;
          
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
    }else{
      this.loading = false;
      this.error = "Form Contains Invalid Fields";
    }


  }

  imageSelected(event){
    console.log(event);

    this.selectedImages = event.file;
  }

}
