import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-obstacle-catalog',
  templateUrl: './obstacle-catalog.component.html',
  styleUrls: ['./obstacle-catalog.component.css']
})
export class ObstacleCatalogComponent implements OnInit {

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
  ) { }

  public obstacles = [[{name: "atest"}], [{name: "btest"}], 'c']

  ngOnInit() {
    this.titleService.setTitle("Obstacle Index")
    this.route.data.subscribe(data => {
      this.obstacles = data['catalog']
    })
  }

}
