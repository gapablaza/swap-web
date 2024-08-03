import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  standalone: true,
  imports: [MatExpansionModule],
})
export class FaqsComponent {}
