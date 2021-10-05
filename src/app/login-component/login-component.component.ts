import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from 'src/models/user';
import { LoadedRouterConfig } from '@angular/router/src/config';

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
  error = null;
  isAuthenticated: Boolean;
  currentUser: User;

  @ViewChild("loader") Loader:ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
    // reset login status
    //this.authenticationService.logout();
    this.isAuthenticated = this.authenticationService.isAuthenticated;

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;
    // console.log(this.renderer);
    // this.renderer.removeClass(this.Loader,"invisible");
    // this.renderer.addClass(this.Loader,"visible");
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.value['email'], this.loginForm.value['password'])
      .pipe(first())
      .subscribe(
        data => {
            this.router.navigate([""]);

            this.loading = false; 
        },
        xher => {
          this.error = xher;
          this.loading = false;
        });
  }

}
