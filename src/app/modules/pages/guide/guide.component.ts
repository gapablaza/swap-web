import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class GuideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
