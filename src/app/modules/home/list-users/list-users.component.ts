import { Component, Input, OnInit } from '@angular/core';
import { Collection } from 'src/app/core';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  @Input() collections: Collection[] = [] ;

  constructor() { }

  ngOnInit(): void {
  }

}
