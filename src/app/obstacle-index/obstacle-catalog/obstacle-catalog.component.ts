import { Component, OnInit } from '@angular/core';
import {Title, Meta} from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import { ObstaclePopUpComponent } from '../obstacle-pop-up/obstacle-pop-up.component';
import { MatDialog } from '@angular/material';
import { DifficultyMatrixComponent } from '../difficulty-matrix/difficulty-matrix.component';
import { ChallengePopUpComponent } from '../view/challenge-pop-up/challenge-pop-up.component';

@Component({
  selector: 'app-obstacle-catalog',
  templateUrl: './obstacle-catalog.component.html',
  styleUrls: ['./obstacle-catalog.component.css']
})
export class ObstacleCatalogComponent implements OnInit {

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private metaService: Meta
  ) { }

  public obstacles = []

  ngOnInit() {
    this.titleService.setTitle("Obstacle Index")
    this.metaService.addTag( { name:'description', content: 'An Index of Obstacle for the Bonfire TTRPG'});
    this.metaService.addTag( { name:'image', content: "../../../assets/TWRealFire.png"});
    this.activatedRoute.data.subscribe(data => {
      this.obstacles = data['catalog']
    })

    if ((this.router.url.match(new RegExp("\/", "g")) || []).length === 2) {
      let id = +this.router.url.split('/')[2]
      if (!isNaN(id)) {
        this.dialog.open(ObstaclePopUpComponent, { width: '400px', data: { id }});
      }
    }
  }

  openObstacle(id, type) {
    if (type === 'obstacle') {
      this.dialog.open(ObstaclePopUpComponent, { width: '400px', data: { id }});
    } else if (type === 'challenge') {
      this.dialog.open(ChallengePopUpComponent, { width: '600px', data: { id }})
    }
  }

  openMatrix() {
    this.dialog.open(DifficultyMatrixComponent)
  }

}
