import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obstacle-catalog',
  templateUrl: './obstacle-catalog.component.html',
  styleUrls: ['./obstacle-catalog.component.css']
})
export class ObstacleCatalogComponent implements OnInit {

  constructor() { }

  public obstacles = [[{name: "atest"}], [{name: "btest"}], 'c']
  ngOnInit() {
  }

}
