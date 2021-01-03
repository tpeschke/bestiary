import { Component } from '@angular/core';
import { BeastService } from './util/services/beast.service';
import variables from '../local.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private beastService: BeastService
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
