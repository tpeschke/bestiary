import { Component, OnInit, Input } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { DifficultyMatrixComponent } from '../../difficulty-matrix/difficulty-matrix.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-obstacle-innards',
  templateUrl: './obstacle-innards.component.html',
  styleUrls: ['./obstacle-innards.component.css']
})
export class ObstacleInnardsComponent implements OnInit {
  @Input() id;
  @Input() goToEdit;

  constructor(
    public obstacleService: ObstacleService,
    public beastService: BeastService,
    private dialog: MatDialog,) { }

  public obstacle: any = {}
  public loggedIn: boolean | string | number = false;
  public loginEndpoint = variables.login

  ngOnInit() {
    this.obstacleService.getObstacle(this.id, 'obstacle').subscribe(obstacle => {
      this.obstacle = obstacle
    })
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }

  ngOnChanges() {
    this.obstacleService.getObstacle(this.id, 'obstacle').subscribe(obstacle => {
      this.obstacle = obstacle
    })
  }

  openMatrix() {
    this.dialog.open(DifficultyMatrixComponent)
  }
}
