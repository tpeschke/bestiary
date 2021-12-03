import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ObstacleService } from 'src/app/util/services/obstacle.service';

@Component({
  selector: 'app-obstacle-edit',
  templateUrl: './obstacle-edit.component.html',
  styleUrls: ['./obstacle-edit.component.css']
})
export class ObstacleEditComponent implements OnInit {
  @Input() obstacle: any;

  constructor(
    public obstacleService: ObstacleService,
    private router: Router,
  ) { }

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
  public row = {
    index: null,
    name: null,
    body: null
  }

  ngOnInit() {
    if (!this.obstacle.name) {
      this.obstacle = {
        id: null,
        type: 'obstacle',
        name: null,
        difficulty: null,
        threshold: null,
        time: null,
        complicationsingle: null,
        complicationtable: [],
        failure: null,
        success: null,
        pairone: [],
        pairtwo: [],
        information: null,
        notes: null
      }
    }
  }

  captureInput(event, type) {
    this.obstacle[type] = event.target.value
  }

  capturePair(event, pair, type) {
    this[pair][type] = event.target.value
  }

  removePair(index, type) {
    this.obstacle[type].splice(index, 1)
  }

  savePair(pair) {
    if (this[pair].name && this[pair].body) {
      this[pair].index = this.obstacle[pair].length
      this.obstacle[pair].push(this[pair])
      this[pair] = {
        index: null,
        name: null,
        body: null
      }
    }
  }

  captureRow(event, type) {
    this.row[type] = event.target.value
  }

  removeRow(index) {
    this.obstacle.complicationtable.splice(index, 1)
  }

  saveRow() {
    if (this.row.name && this.row.body) {
      this.row.index = this.obstacle.complicationtable.length
      this.obstacle.complicationtable.push(this.row)
      this.row = {
        index: null,
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
    this.obstacleService.deleteObstacle(this.obstacle.id).subscribe(_ => this.router.navigate([`/obstacle`]))
  }
}
