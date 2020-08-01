import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BeastService } from './util/services/beast.service';
import { Location } from '@angular/common';
import variables from '../local.js'
import { VariableAst } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private router: Router,
    private beastService: BeastService,
    private location: Location
  ) {  }

  public loggedIn:boolean|string|number = false;
  public loginEndpoint = variables.login

  ngOnInit() {
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }
}
