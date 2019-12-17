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
      this.beastService.checkLogin().subscribe(result => {
        if (result) {
          this.router.navigate(['/main/catalog'])
        }
      })
    }
  }

}
