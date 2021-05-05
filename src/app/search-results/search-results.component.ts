import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeastService } from 'src/app/util/services/beast.service';
import variables from '../../local.js'
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public imageBase = variables.imageBase;

  constructor(
    public router: Router,
    public currentRoute: ActivatedRoute,
    public adventureService: BeastService,
    public titleService: Title
  ) { }

  public beasts = 'loading'

  ngOnInit() {
    this.adventureService.searchBeasts(this.currentRoute.snapshot.params).subscribe(incomingBeasts => {
      this.beasts = incomingBeasts
    })
    this.titleService.setTitle('Bestiary')
    
    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        this.beasts = 'loading'
        this.adventureService.searchBeasts(this.currentRoute.snapshot.params).subscribe(incomingBeasts => {
          this.beasts = incomingBeasts
        })
      }
    })
  }

  getRandom() {
    let randomBeast: any = this.beasts[Math.floor(Math.random() * this.beasts.length)]
    this.router.navigate(['/beast', randomBeast.id, 'gm']);
  }

}
