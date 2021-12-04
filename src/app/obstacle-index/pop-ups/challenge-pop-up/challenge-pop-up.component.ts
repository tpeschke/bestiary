import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { DifficultyMatrixComponent } from '../../difficulty-matrix/difficulty-matrix.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-challenge-pop-up',
  templateUrl: './challenge-pop-up.component.html',
  styleUrls: ['./challenge-pop-up.component.css']
})
export class ChallengePopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<ChallengePopUpComponent>,
    public obstacleService: ObstacleService,
    public beastService: BeastService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  public challenge: any = {}
  public loggedIn: boolean | string | number = false;
  public loginEndpoint = variables.login

  ngOnInit() {
    this.obstacleService.getObstacle(this.data.id, 'challenge').subscribe(challenge => {
      this.challenge = challenge
    })
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }
  
  goToEdit() {
    this.dialogRef.close();
    this.router.navigate([`/obstacle/edit/${this.challenge.id}`])
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
