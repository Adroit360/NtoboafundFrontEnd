import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  
  @ViewChild("legalbox") legalbox:ElementRef;

  constructor(private authService: AuthService,private router:Router) { }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      'firstName': new FormControl(null,Validators.required),
      'lastName': new FormControl(""),
      'email': new FormControl("",),
      'phoneNumber': new FormControl(null,Validators.required),
      'password': new FormControl(null,Validators.required),
      'confirmPassword': new FormControl("")
      
    })
    this.selectedImages = null;
  }

  register() {
    if(!this.legalbox.nativeElement.checked){
      this.error = "Please agree to our terms and conditions";
      return
    }
    this.loading = true;
    this.error = null;

    if(this.registrationForm.valid){
      var formData = new FormData();
      formData.append('images',this.selectedImages)
      formData.append('firstName',this.registrationForm.value["firstName"])
      formData.append('lastName',"")
      formData.append('email',"")
      formData.append('phoneNumber',this.registrationForm.value["phoneNumber"])
      formData.append('password',this.registrationForm.value["password"])
      formData.append('confirmPassword',this.registrationForm.value["password"])
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
            //this.authService.isAuthenticated = true;
            this.router.navigate(['']);
          }
          this.loading = false;
          
        },
        xher => {
          if(xher.error){
            this.error = xher.error;
          }else{
            this.error = xher;
          }
          
          this.loading = false;
        }
      );
    }else{
      this.loading = false;
      this.error = "Form Contains Invalid Fields";
      return;
    }
  }

  imageSelected(event){
    console.log(event);

    this.selectedImages = event.file;
  }

}
