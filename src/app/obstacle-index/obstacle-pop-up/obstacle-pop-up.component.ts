import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ObstacleService } from 'src/app/util/services/obstacle.service';

@Component({
  selector: 'app-obstacle-pop-up',
  templateUrl: './obstacle-pop-up.component.html',
  styleUrls: ['./obstacle-pop-up.component.css']
})
export class ObstaclePopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    public dialogRef: MatDialogRef<ObstaclePopUpComponent>,
    public obstacleService: ObstacleService
  ) { }

  public obstacle: any = {}

  ngOnInit() {
    this.obstacleService.getObstacle(this.data.id).subscribe(obstacle => {
      this.obstacle = obstacle
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
