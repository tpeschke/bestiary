import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeastService } from '../util/services/beast.service';
import variables from '../../local.js'

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

  public loginEndpoint = variables.login

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
