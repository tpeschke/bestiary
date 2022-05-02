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

  skillMatrix = [
    [
      '+0', 'Diffic', 'Diffic',
      'Ave', 'Ave', 'Ave',
      'Easy', 'Easy', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Auto', 'Auto', 'Auto',
      'Auto'
    ],
    [
      '+d4!', 'Hard', 'Hard',
      'Hard', 'Diffic', 'Diffic',
      'Diffic', 'Ave', 'Ave',
      'Easy', 'Easy', 'Easy',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial'
    ],
    [
      '+d6!', 'Hard', 'Hard',
      'Hard', 'Hard', 'Diffic',
      'Diffic', 'Diffic', 'Ave',
      'Ave', 'Easy', 'Easy',
      'Easy', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial'
    ],
    [
      '+d8!', 'Hard', 'Hard',
      'Hard', 'Hard', 'Hard',
      'Diffic', 'Diffic', 'Diffic',
      'Ave', 'Ave', 'Easy',
      'Easy', 'Easy', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial'
    ],
    [
      '+d10!', 'Challen', 'Hard',
      'Hard', 'Hard', 'Hard',
      'Hard', 'Diffic', 'Diffic',
      'Diffic', 'Ave', 'Ave',
      'Easy', 'Easy', 'Easy',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial'
    ],
    [
      '+d12!', 'Challen', 'Challen',
      'Hard', 'Hard', 'Hard',
      'Hard', 'Hard', 'Diffic',
      'Diffic', 'Diffic', 'Ave',
      'Ave', 'Easy', 'Easy',
      'Easy', 'Trivial', 'Trivial',
      'Trivial', 'Trivial', 'Trivial',
      'Trivial'
    ],
    [
      '+d20!', 'Impos', 'Challen',
      'Challen', 'Challen', 'Challen',
      'Challen', 'Hard', 'Hard',
      'Hard', 'Hard', 'Hard',
      'Diffic', 'Diffic', 'Diffic',
      'Ave', 'Ave', 'Easy',
      'Easy', 'Easy', 'Trivial',
      'Trivial'
    ],
    [
      '+d20!+d4!', 'Impos', 'Impos',
      'Impos', 'Impos', 'Challen',
      'Challen', 'Challen', 'Challen',
      'Challen', 'Challen', 'Hard',
      'Hard', 'Hard', 'Hard',
      'Diffic', 'Diffic', 'Diffic',
      'Ave', 'Ave', 'Ave',
      'Easy'
    ],
    [
      '+d20!+d6!', 'Impos', 'Impos',
      'Impos', 'Impos', 'Impos',
      'Challen', 'Challen', 'Challen',
      'Challen', 'Challen', 'Hard',
      'Hard', 'Hard', 'Hard',
      'Hard', 'Diffic', 'Diffic',
      'Diffic', 'Ave', 'Ave',
      'Ave'
    ],
    [
      '+d20!+d8!', 'Impos', 'Impos',
      'Impos', 'Impos', 'Impos',
      'Impos', 'Challen', 'Challen',
      'Challen', 'Challen', 'Challen',
      'Hard', 'Hard', 'Hard',
      'Hard', 'Hard', 'Diffic',
      'Diffic', 'Diffic', 'Ave', 'Ave'
    ],
    [
      '+d20!+d10!', 'Impos',
      'Impos', 'Impos',
      'Impos', 'Impos',
      'Impos', 'Impos',
      'Challen', 'Challen',
      'Challen', 'Challen',
      'Challen', 'Hard',
      'Hard', 'Hard',
      'Hard', 'Hard',
      'Diffic', 'Diffic',
      'Diffic', 'Ave'
    ],
    [
      '+d20!+d12!', 'Impos',
      'Impos', 'Impos',
      'Impos', 'Impos',
      'Impos', 'Impos',
      'Impos', 'Challen',
      'Challen', 'Challen',
      'Challen', 'Challen',
      'Hard', 'Hard',
      'Hard', 'Hard',
      'Hard', 'Diffic',
      'Diffic', 'Diffic'
    ],
    [
      '+2d20!', 'Impos', 'Impos',
      'Impos', 'Impos', 'Impos',
      'Impos', 'Impos', 'Impos',
      'Impos', 'Impos', 'Impos',
      'Impos', 'Challen', 'Challen',
      'Challen', 'Challen', 'Challen',
      'Hard', 'Hard', 'Hard',
      'Hard'
    ]
  ]

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
