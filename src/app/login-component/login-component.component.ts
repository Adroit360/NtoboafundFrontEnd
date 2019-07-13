import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from 'src/models/user';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  isAuthenticated:Boolean;
  currentUser:User;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email':new FormControl(''),
      'password':new FormControl('')
    });
    // reset login status
    //this.authenticationService.logout();
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.value['email'], this.loginForm.value['password'])
        .pipe(first())
        .subscribe(
            data => {
                if(this.isAuthenticated)
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.loading = false;
            });
}

}
