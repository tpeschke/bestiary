import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-hewy-rating',
  templateUrl: './hewy-rating.component.html',
  styleUrls: ['./hewy-rating.component.css']
})
export class HewyRatingComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HewyRatingComponent>
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
