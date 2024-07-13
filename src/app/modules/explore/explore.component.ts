import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class ExploreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
