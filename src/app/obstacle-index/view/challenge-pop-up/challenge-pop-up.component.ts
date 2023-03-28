import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-challenge-pop-up',
  templateUrl: './challenge-pop-up.component.html',
  styleUrls: ['./challenge-pop-up.component.css']
})
export class ChallengePopUpComponent implements OnInit {

  public id

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
  ) {}

  ngOnInit() {
    this.id = this.data.id
  }
}
