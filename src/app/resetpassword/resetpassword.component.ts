import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from 'src/settings';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  @ViewChild("mailInput") inputElement:ElementRef;

  errorMessage:string
  isSuccessful:boolean = false;
  isbuttonHidden:boolean = false;

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
  }

  ResetPassword(){
    this.isbuttonHidden = true;

    if(this.inputElement.nativeElement.validity.valid){
      let inputValue = this.inputElement.nativeElement.value;
      this.httpClient.get(`${settings.currentApiUrl}/users/resetpassword/initiate/${inputValue}`)
      .subscribe(data=>{
        this.isSuccessful = true;
        this.isbuttonHidden = false;
      },xhr=>{
        if(xhr.error)
           this.errorMessage = xhr.error.message;
        this.isbuttonHidden = false;
      })
    }else{
      this.errorMessage = this.inputElement.nativeElement.validationMessage;
      this.isbuttonHidden = false;
    }
  }
}
