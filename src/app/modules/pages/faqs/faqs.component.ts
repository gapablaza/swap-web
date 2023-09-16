import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss'],
    standalone: true,
    imports: [MatExpansionModule]
})
export class FaqsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
