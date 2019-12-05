import { Component } from '@angular/core';
import { settings } from 'src/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ntuboa-fund';
  settings = settings;
}
