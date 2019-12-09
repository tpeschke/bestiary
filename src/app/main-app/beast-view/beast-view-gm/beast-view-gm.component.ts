import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['./beast-view-gm.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  public beast = {}

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
  }

}
