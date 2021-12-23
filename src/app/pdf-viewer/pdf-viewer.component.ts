import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {

  pdfSource:string = "/assets/TERMS_AND_CONDITIONS.pdf";

  @Input("showHeader")showHeader = true;
  constructor() { }

  ngOnInit() {
    //get the currrent page's url
    var path = window.location.href;
    if(path.includes("terms")){
      this.pdfSource = "/assets/TERMS_AND_CONDITIONS.pdf";
    }else if(path.includes("cookiepolicy")){
      this.pdfSource = "/assets/PRIVACY & COOKIE POLICY.pdf";
    }
  }

}
