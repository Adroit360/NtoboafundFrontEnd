import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tnxluckyme',
  templateUrl: './tnxluckyme.component.html',
  styleUrls: ['./tnxluckyme.component.scss']
})
export class TnxluckymeComponent implements OnInit {

  mode:string;
  constructor(private router:ActivatedRoute) { }

  ngOnInit() {
    this.mode = <string>this.router.snapshot.queryParams['mode'];

    setTimeout(()=>{
      window.close();
    },5000);
  }
  
}
