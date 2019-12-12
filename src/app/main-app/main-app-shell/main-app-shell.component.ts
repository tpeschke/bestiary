import { Component, OnInit } from '@angular/core';
import { BeastService } from '../../util/services/beast.service'

@Component({
  selector: 'app-main-app-shell',
  templateUrl: './main-app-shell.component.html',
  styleUrls: ['./main-app-shell.component.css']
})
export class MainAppShellComponent implements OnInit {

  constructor(
    private beastService: BeastService
  ) { }

  public loggedIn = this.beastService.loggedIn || false;

  ngOnInit() {
  }

}
