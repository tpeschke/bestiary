import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import variables from '../../../../local.js'

@Component({
  selector: 'app-beast-view-player',
  templateUrl: './beast-view-player.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewPlayerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  public beast = {name: null, id: null, notes: null}
  public imageBase = variables.imageBase;

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
  }

}
