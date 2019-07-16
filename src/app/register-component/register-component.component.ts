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
  }

  register() {
    this.loading = true;
    this.error = null;
    if(this.registrationForm.valid){
      this.authService.register(
        this.registrationForm.value["firstName"],
        this.registrationForm.value["lastName"],
        this.registrationForm.value["email"],
        this.registrationForm.value["phoneNumber"],
        this.registrationForm.value["password"],
        this.registrationForm.value["confirmPassword"],
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

}
