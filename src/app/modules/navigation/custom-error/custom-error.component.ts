import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class CustomErrorComponent {}
