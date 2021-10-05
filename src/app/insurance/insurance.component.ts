import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  loading = false;
  error = null;
  errorShown = false;
  closePopup() {
    this.error = null;
    this.errorShown = false;
  }
  constructor() { }

  ngOnInit() {
  }

}
