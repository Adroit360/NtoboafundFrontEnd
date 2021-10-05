import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-busy',
  templateUrl: './busy.component.html',
  styleUrls: ['./busy.component.scss']
})
export class BusyComponent implements OnInit {

  @Input("isWholePage") IsWholePage = true;
  @Input("text") Text:string;
  constructor() { }

  ngOnInit() {
  }

}
