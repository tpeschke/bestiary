import { Component, OnInit } from '@angular/core';
import { BeastService } from './util/services/beast.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private beastService: BeastService
  ) {  }

  ngOnInit() {
    this.beastService.checkLogin().subscribe().unsubscribe()
  }
}
