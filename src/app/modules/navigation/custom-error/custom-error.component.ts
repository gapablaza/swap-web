import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-custom-error',
    templateUrl: './custom-error.component.html',
    styleUrls: ['./custom-error.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class CustomErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
