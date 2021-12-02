import { Component, OnInit } from '@angular/core';
import { BeastService } from '../../util/services/beast.service';
import variables from '../../../local.js'

@Component({
  selector: 'app-obstacle-home',
  templateUrl: './obstacle-home.component.html',
  styleUrls: ['./obstacle-home.component.css']
})
export class ObstacleHomeComponent implements OnInit {
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
