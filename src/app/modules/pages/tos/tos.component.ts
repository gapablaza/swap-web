import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tos',
    templateUrl: './tos.component.html',
    styleUrls: ['./tos.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class TosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
