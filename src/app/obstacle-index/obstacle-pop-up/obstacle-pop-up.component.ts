import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obstacle-pop-up',
  templateUrl: './obstacle-pop-up.component.html',
  styleUrls: ['./obstacle-pop-up.component.css']
})
export class ObstaclePopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    public dialogRef: MatDialogRef<ObstaclePopUpComponent>,
    private router: Router,
  ) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToEditBinded = this.goToEdit.bind(this)
  
  goToEdit() {
    this.dialogRef.close();
    this.router.navigate([`/obstacle/edit/${this.data.id}`])
  }
}
