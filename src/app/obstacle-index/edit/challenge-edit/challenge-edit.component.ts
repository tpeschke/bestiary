import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css']
})
export class ChallengeEditComponent implements OnInit {
  @Input() challenge: any;

  constructor() { }

  ngOnInit() {
    if (!this.challenge.name) {
      this.challenge = {
        id: null,
        type: 'challenge',
        name: null
      }
    }
  }

}
