import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formControlBinding } from '@angular/forms/src/directives/reactive_directives/form_control_directive';
import { settings } from 'src/settings';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private httpClient:HttpClient) { }

  loading = false;
  message:{text,type,color};
  contactForm = new FormGroup({
    name : new FormControl("",Validators.required),
    email:new FormControl("",Validators.required),
    mobileNumber:new FormControl(""),
    reason:new FormControl(""),
    description:new FormControl("")
  })
  ngOnInit() {
  }

  sumbitContactForm(){
    if(this.contactForm.valid){

      this.httpClient.post(`${settings.currentApiUrl}/contactus/postmessage`,this.contactForm.value)
      .subscribe(response => {
        this.showMessage({text:"Message Sent Successfully",type:"success",color:"red"});
        this.loading = false;
      },error=>{
        this.loading = false;
      });
  
      return;
    }

    this.showMessage({text:"Form Contains Invalid Fields",type:"error",color:"#681919"});
  }

  showMessage(message : {text,type,color}){
    this.message = message;
    this.contactForm.reset();
    window.setTimeout(()=>{
      this.message = null;
    },5000);

  }
}
