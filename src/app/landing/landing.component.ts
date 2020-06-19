import { Component, OnInit } from '@angular/core';
import variables from '../../local.js'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor() { }

  public loginEndpoint = variables.login

  ngOnInit() {
  }

}
