import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webmail',
  templateUrl: './webmail.component.html',
  styleUrls: ['./webmail.component.scss']
})
export class WebmailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.href = "https://n3plvcpnl39229.prod.ams3.secureserver.net:2096/cpsess1317043690/webmail/paper_lantern/index.html?login=1&post_login=7933477309490";
  }

}
