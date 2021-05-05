import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeastService } from 'src/app/util/services/beast.service';
import variables from '../../local.js'
import { Title } from "@angular/platform-browser";

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
    public titleService: Title,
    public beastService: BeastService
  ) { }

  public beasts = 'loading'

  ngOnInit() {
    let { params } = this.currentRoute.snapshot
    this.titleService.setTitle('Bestiary')
    this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
      this.beasts = incomingBeasts
      if (params.goDirectlyTo) {
        this.getRandom()
      }
    })

    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        this.beasts = 'loading'
        this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
          this.beasts = incomingBeasts
        })
      }
    })
  }

  getRandom() {
    let randomBeast: any = this.weight_random(this.beasts, 'rarity')
    this.router.navigate(['/beast', randomBeast.id, 'gm']);
  }

  weight_random(arr, weight_field) {

    if (arr == null || arr === undefined) {
      return null;
    }
    const totals = [];
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += arr[i][weight_field];
      totals.push(total);
    }
    const rnd = Math.floor(Math.random() * total);
    let selected = arr[0];
    for (let i = 0; i < totals.length; i++) {
      if (totals[i] > rnd) {
        selected = arr[i];
        break;
      }
    }
    return selected;

  }

  getShortCutURL() {
    let textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    textArea.value = `${window.location.href};goDirectlyTo=true`;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      this.beastService.handleMessage({ color: 'green', message: `${window.location.href};goDirectlyTo=true successfully copied` })
    } catch (err) {
      this.beastService.handleMessage({ color: 'red', message: `Unable to copy ${window.location.href};goDirectlyTo=true` })
    }

    document.body.removeChild(textArea);
  }
}
