import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BeastService } from './util/services/beast.service';
import {Location} from '@angular/common';

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

  ngOnInit() {
    if (!this.beastService.loggedIn) {
      this.beastService.checkLogin().subscribe(result => {
        if (result) {
          this.router.navigate([this.location.path() ? this.location.path() : '/main/catalog'])
        } else {
          this.router.navigate(['/login'])
        }
      })
    }
  }
}
