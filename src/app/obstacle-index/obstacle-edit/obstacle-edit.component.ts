import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObstacleService } from 'src/app/util/services/obstacle.service';

@Component({
  selector: 'app-obstacle-edit',
  templateUrl: './obstacle-edit.component.html',
  styleUrls: ['./obstacle-edit.component.css']
})
export class ObstacleEditComponent implements OnInit {

  constructor(
    public obstacleService: ObstacleService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  public obstacle = {
    id: null,
    type: 'obstacle',
    name: null,
    difficulty: null,
    threshold: null,
    time: null,
    complicationsingle: null,
    failure: null,
    success: null,
    pairone: [],
    pairtwo: [],
    information: null,
    notes: null
  }

  public pairone = {
    index: null,
    name: null,
    body: null
  }
  public pairtwo = {
    index: null,
    name: null,
    body: null
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      let obstacle = data['obstacle']
      if (obstacle) {
        this.obstacle = obstacle
      }
    })
  }

  captureInput(event, type) {
    this.obstacle[type] = event.target.value
  }

  capturePair(event, pair, type) {
    this[pair][type] = event.target.value
  }

  savePair(pair) {
    if (this[pair].name && this[pair].body) {
      this[pair].index = this.obstacle[pair].length
      this.obstacle[pair].push(this[pair])
      this[pair] = {
        name: null,
        body: null
      }
    }
  }

  captureHTML(event, type) {
    this.obstacle = Object.assign({}, this.obstacle, { [type]: event.html })
  }

  saveChanges() {
    if (this.obstacle.name) {
      this.obstacleService.updateObstacle(this.obstacle).subscribe(_ => this.router.navigate([`/obstacle`]))
    }
  }

  deleteThis() {

  }
}
