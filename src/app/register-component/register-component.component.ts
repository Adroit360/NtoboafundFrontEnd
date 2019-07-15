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

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      'firstName': new FormControl(null,[Validators.required]),
      'lastName': new FormControl(null,[Validators.required]),
      'emailOrNumber': new FormControl(null,[Validators.required]),
      'password': new FormControl(null,[Validators.required]),
      'confirmPassword': new FormControl(null,[Validators.required])
    })
  }

  register() {
    this.authService.register(
      this.registrationForm.value["firstName"],
      this.registrationForm.value["lastName"],
      this.registrationForm.value["emailOrNumber"],
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

      },
      error => {
        console.log("Error");
        console.log(error);
      }
    );

  }

}
