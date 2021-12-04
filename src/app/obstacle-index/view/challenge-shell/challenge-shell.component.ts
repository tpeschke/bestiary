import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challenge-shell',
  templateUrl: './challenge-shell.component.html',
  styleUrls: ['./challenge-shell.component.css']
})
export class ChallengeShellComponent implements OnInit {

  constructor(
    public route: Router
  ) { }

  public id = 0

  ngOnInit() {
    this.id = +this.route.url.split('/')[3];
  }

}
