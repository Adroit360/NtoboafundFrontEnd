import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = false;
  error = null;
  selectedImages:any;
  registrationForm:FormGroup
  constructor() { }

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
  
  }

  imageSelected(event){
    console.log(event);

    this.selectedImages = event.file;
  }
}
