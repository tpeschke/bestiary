import { Component, OnInit, Input } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { DifficultyMatrixComponent } from '../../difficulty-matrix/difficulty-matrix.component';
import { MatDialog } from '@angular/material';
import local from '../../../../local.js'
import { unescape } from 'querystring';

@Component({
  selector: 'app-obstacle-innards',
  templateUrl: './obstacle-innards.component.html',
  styleUrls: ['./obstacle-innards.component.css']
})
export class ObstacleInnardsComponent implements OnInit {
  @Input() id;
  @Input() difficulty;
  @Input() goToEdit;

  constructor(
    public obstacleService: ObstacleService,
    public beastService: BeastService,
    private dialog: MatDialog,
  ) { }

  public obstacle: any = {}
  public loggedIn: any = false;
  public loginEndpoint = variables.login
  public originalDifficulty;

  public diceRegex = /(\d+)?d(\d+)!([\+])(\d+)?d(\d+)!|(\d+)?d(\d+)!|0/ig

  public noviceDifficulties = [
    '0', 'd10!', 'd20!'
  ]
  public journeymanDifficulties = [
    '0', 'd10!', 'd20!', 'd10!+d20!'
  ]
  public expertDifficulties = [
    '0', 'd10!', 'd20!', 'd10!+d20!', 'd20!'
  ]
  public masterDifficulties = [
    'd10!', 'd20!', 'd10!+d20!', 'd20!', 'd10!+2d20!'
  ]
  public grandmasterDifficulties = [
    'd20!', 'd10!+d20!', 'd20!', 'd10!+2d20!', '3d20!'
  ]
  public legendDifficulties = [
    'd10!+d20!', 'd20!', 'd10!+2d20!', '3d20!', 'd10!+3d20!'
  ]
  public mythDifficulties = [
    'd20!', 'd10!+2d20!', '3d20!', 'd10!+3d20!', '4d20!'
  ]

  ngOnInit() {
    !this.difficulty ? this.difficulty = '' : null
    this.getObstacle()
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }

  ngOnChanges() {
    this.getObstacle()
  }

  getObstacle() {
    this.obstacleService.getObstacle(this.id, 'obstacle').subscribe(obstacle => {
      this.originalDifficulty = obstacle.difficulty
      if (this.difficulty && obstacle.difficulty) {
        this.difficulty = this.difficulty.replace('_', '+')
        obstacle.difficulty = obstacle.difficulty.replace(this.diceRegex, this.difficulty)
      }
      this.obstacle = obstacle
    })
  }

  captureDifficulty = (event) => {
    if (event.target.value !== '') {
      this.difficulty = event.target.value
      this.obstacle.difficulty = this.obstacle.difficulty.replace(this.diceRegex, this.difficulty)
    } else {
      this.obstacle.difficulty = this.originalDifficulty
    }
  }

  getDifficultyDescriptor(index) {
    const descriptorDictionary = ['Routine', 'Easy', 'Ave.', 'Hard', 'Chall.']
    return descriptorDictionary[index]
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
    selBox.value = local.endpointBase + '/obstacle/' + id + (this.difficulty && this.difficulty !== '' ? `/${this.difficulty.replace('+', '_')}` : '');
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.beastService.handleMessage({ message: 'Quick Link Copied', color: 'green' })
  }
}
