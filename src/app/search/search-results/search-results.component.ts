import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeastService } from 'src/app/util/services/beast.service';
import variables from '../../../local.js'
import { Title, Meta } from "@angular/platform-browser";
import { MatDialog } from '@angular/material';
import { AddToListPopUpComponent } from '../../random-encounters/add-to-list-pop-up/add-to-list-pop-up.component';

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
    private dialog: MatDialog,
    public metaService: Meta
  ) { }

  public beasts: any = 'loading'

  ngOnInit() {
    let { params } = this.currentRoute.snapshot
    if (params.savedRoute) {
      const routeDictionary = {
        wisthulzLowlandGeneral: {climate: 13},
        wisthulzPrenMire: {climate: 9},
        wisthulzHighlandGeneral: {climate: 10}
      }
      params = {...routeDictionary[params.savedRoute], goDirectlyTo: true}
    }
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

  returnAtkDefNotation = (attack, defense) => {
    if (attack && defense) {
      return 'AD'
    } else if (attack) {
      return 'A'
    } else if (defense) {
      return 'D'
    }
  }

  openRandomListsPopUp() {
    const beastidarray = this.beasts.map(beast => {return {beastid: +beast.id, rarity: beast.rarity}})
    this.dialog.open(AddToListPopUpComponent, { width: '400px', data: { beastidarray } });
  }

  returnAtkDefTooltip = (type, attack, defense) => {
    if (attack && defense) {
      return `This monster has additional ${type} attack & defense abilities that will make them stronger than their raw stats might suggestion.`
    } else if (attack) {
      return `This monster has additional ${type} attack abilities that will make them stronger than their raw stats might suggestion.`
    } else if (defense) {
      return `This monster has additional ${type} defense abilities that will make them stronger than their raw stats might suggestion.`
    }
  }
}
