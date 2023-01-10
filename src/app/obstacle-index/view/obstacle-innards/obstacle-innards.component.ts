import { Component, OnInit, Input } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { DifficultyMatrixComponent } from '../../difficulty-matrix/difficulty-matrix.component';
import { MatDialog } from '@angular/material';
import local from '../../../../local.js'

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
    private dialog: MatDialog,
  ) { }

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

  copyLink(id) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = local.endpointBase + '/obstacle/' + id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.beastService.handleMessage({ message: 'Quick Link Copied', color: 'green' })
  }
}
