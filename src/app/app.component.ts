import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { settings } from 'src/settings';

declare let fbq:Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ntuboa-fund';
  settings = settings;
  constructor(private router: Router){

    router.events.subscribe((y: NavigationEnd) => {
      if(y instanceof NavigationEnd){
        fbq('track', 'PageView');
      }
    });
  
  }
}
