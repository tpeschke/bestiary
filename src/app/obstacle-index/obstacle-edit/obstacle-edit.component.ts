import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obstacle-edit',
  templateUrl: './obstacle-edit.component.html',
  styleUrls: ['./obstacle-edit.component.css']
})
export class ObstacleEditComponent implements OnInit {

  constructor() { }

  public obstacle = {
    type: 'obstacle',
    name: null,
    difficulty: null,
    threshold: null,
    time: null,
    complicationsingle: null,
    failure: null,
    success: null
  }
  ngOnInit() {
  }

  captureInput(event, name) {

  }

}
