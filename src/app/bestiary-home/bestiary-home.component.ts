import { Component, OnInit } from '@angular/core';
import { BeastService } from '../util/services/beast.service';
import variables from '../../local.js'

@Component({
  selector: 'app-bestiary-home',
  templateUrl: './bestiary-home.component.html',
  styleUrls: ['./bestiary-home.component.css']
})
export class BestiaryHomeComponent implements OnInit {
  constructor(
    private beastService: BeastService
  ) {  }

  public loggedIn:any = false;
  public loginEndpoint = variables.login

  ngOnInit() {
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }

}
