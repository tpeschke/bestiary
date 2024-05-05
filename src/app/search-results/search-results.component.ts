import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeastService } from 'src/app/util/services/beast.service';
import variables from '../../local.js'
import { Title, Meta } from "@angular/platform-browser";

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
    public beastService: BeastService,
    public metaService: Meta
  ) { }

  public beasts = 'loading'

  ngOnInit() {
    let { params } = this.currentRoute.snapshot
    this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
      this.beasts = incomingBeasts
      if (params.goDirectlyTo) {
        this.getRandom()
      }
    })
    
    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        params = this.currentRoute.snapshot.params
        this.beasts = 'loading'
        this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
          this.beasts = incomingBeasts
        })
      }
    })
    this.titleService.setTitle('Bestiary')
    this.metaService.updateTag( { name:'og:description', content: 'The Bestiary for the Bonfire TTRPG'});
    this.metaService.updateTag( { name:'og:image', content: "https://bestiary.stone-fish.com/assets/TWRealFire.png"});
  }

  getRandom() {
    let { params } = this.currentRoute.snapshot
    let rarity
    if (!params.rarity) {
      rarity = this.getRarity();
    } else {
      rarity = params.rarity
    }
    this.adventureService.searchBeasts({...params, rarity}).subscribe(incomingBeasts => {
      const randomIndex = Math.floor(Math.random() * incomingBeasts.length)
      this.router.navigate(['/beast', incomingBeasts[randomIndex].id, 'gm']);
    })
  }

  getRarity () {
    const result = Math.floor(Math.random() * 40) + 1

    if (result <= 27) {
      return 10
    } else if (result <= 36) {
      return 5
    } else if (result <= 39) {
      return 3
    } else if (result <= 40) {
      return 1
    } else {
      console.log('error when getting rarity')
    }
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

  formatPoints (min, max) {
    return min === max ? min : `${min} - ${max}`
  }
}
