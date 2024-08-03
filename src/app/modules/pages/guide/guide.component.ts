import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class GuideComponent {}
