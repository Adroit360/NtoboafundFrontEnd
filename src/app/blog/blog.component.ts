import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/services/authservice';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  loading = true;
  constructor(private authenticationService:AuthService,private domSanitizer:DomSanitizer) { }
  iframeSrc:any = this.domSanitizer.bypassSecurityTrustResourceUrl("https://gustavliqueurs.com/en/");
  isAdmin:Boolean = false;
  ngOnInit() {
    
  if(this.authenticationService.currentUser){
      this.authenticationService.getUserRole(this.authenticationService.currentUser.id).subscribe((response:any)=>{
        if(response.role == "Admin"){
          this.isAdmin = true;
          //this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl("https://gustavliqueurs.com/en/");
        }else{
          this.isAdmin = false;
          this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl("https://gustavliqueurs.com/en/");
        }
      });
    }
    else{
      this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl("https://gustavliqueurs.com/en/");
    }
  }

  iframeLoad(event){
    console.log(event.path[0].src);
    this.loading = false;
  }


  proceedToAdminPage(){
    window.location.href = "https://gustavliqueurs.com/en/wp-admin/";
  }
}
