import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeastService } from '../services/beast.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private router: Router,
    private beastService: BeastService
  ) { }

  ngOnInit() {
    if (!this.beastService.loggedIn) {
      this.beastService.checkLogin().subscribe(_ => {
        this.checkLogin()
      })
    }
  }

  checkLogin() {
    if (this.beastService.loggedIn) {
      this.router.navigate(['/main/catalog'])
    }
  }

}
