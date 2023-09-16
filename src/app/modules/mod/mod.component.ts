import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-mod',
    templateUrl: './mod.component.html',
    styleUrls: ['./mod.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class ModComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
