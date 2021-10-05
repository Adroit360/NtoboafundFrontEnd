import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/authservice';

@Component({
  selector: 'app-resetpasswordform',
  templateUrl: './resetpasswordform.component.html',
  styleUrls: ['./resetpasswordform.component.scss']
})
export class ResetpasswordformComponent implements OnInit {
  
  @ViewChild("password") txtPassword:ElementRef;
  @ViewChild("confirmpassword") txtConfirmPassword:ElementRef;

  errorMessage:string
  isSuccessful:boolean = false;
  passwordResettoken: any;
  isbuttonHidden:boolean = false;


  constructor(private http:HttpClient,private activatedRoute:ActivatedRoute,
    private router:Router,
    private authenticationService:AuthService) { }

  ngOnInit() {
    this.passwordResettoken = this.activatedRoute.snapshot.queryParams['token'];
    console.log("passwordResettoken");
    console.log(this.passwordResettoken);
  }

  ResetPassword(){
    this.isbuttonHidden = true;
    var password = this.txtPassword.nativeElement.value;
    var confirmPassword = this.txtConfirmPassword.nativeElement.value;

    if(!password){
      this.errorMessage = "Please enter your new password";
      this.isbuttonHidden = false;
      return;
    }

    if(password != confirmPassword){
      this.errorMessage = "The two passwords do not match";
      this.isbuttonHidden = false;
      return;
    }
    
    this.http.post(`${settings.currentApiUrl}/users/resetpassword/change`,{newPassword:password,resetToken:this.passwordResettoken})
      .subscribe((data:any)=>{

        this.isSuccessful = true;
        this.isbuttonHidden = false;

        setTimeout((() => {
          this.authenticationService.login(data.email, data.password)
          .subscribe(
            data => {
                this.router.navigate([""]);
            },
            error => {
              this.router.navigate(["login"]);
            });
        }).bind(this), 5000);
       
      },
      xhr=>{
        this.isSuccessful = false;
        this.isbuttonHidden = false;
        this.errorMessage = xhr.error.message;
      });
  }

}
