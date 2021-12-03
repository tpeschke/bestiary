import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-difficulty-matrix',
  templateUrl: './difficulty-matrix.component.html',
  styleUrls: ['./difficulty-matrix.component.css']
})
export class DifficultyMatrixComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DifficultyMatrixComponent>,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
