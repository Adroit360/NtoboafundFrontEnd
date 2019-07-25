import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/services/faqService';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  
  constructor(private faqService:FaqService) { }

  ngOnInit() {
  }

  closefaq(){
    this.faqService.isShown = false;
  }
}
