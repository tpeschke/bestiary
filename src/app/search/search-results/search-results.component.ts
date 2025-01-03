import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeastService } from 'src/app/util/services/beast.service';
import variables from '../../../local.js'
import { Title, Meta } from "@angular/platform-browser";
import { MatDialog } from '@angular/material';
import { AddToListPopUpComponent } from '../../random-encounters/add-to-list-pop-up/add-to-list-pop-up.component';
import { QuickViewService } from 'src/app/util/services/quick-view.service';

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
    public metaService: Meta,
    public quickViewService: QuickViewService,
  ) { }

  public beasts: any = 'loading'
  public filteredBeasts: any = 'loading'
  public filter: any = 'name';
  public direction: any = 'asc'
  public checkForAttack = false;
  public checkForDefense = false;

  ngOnInit() {
    let { params } = this.currentRoute.snapshot
    this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
      this.beasts = incomingBeasts
      this.filterBy()
      if (params.goDirectlyTo) {
        this.getRandom()
      }
    })

    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        params = this.currentRoute.snapshot.params

        if (Object.keys(params).length === 0) {
          this.router.navigate(['/']);
        }

        this.filteredBeasts = 'loading'
        this.adventureService.searchBeasts(params).subscribe(incomingBeasts => {
          this.beasts = incomingBeasts
          this.filterBy()
        })
      }
    })
    this.titleService.setTitle('Bestiary')
    this.metaService.updateTag({ name: 'og:description', content: 'The Bestiary for the Bonfire TTRPG' });
    this.metaService.updateTag({ name: 'og:image', content: "https://bestiary.stone-fish.com/assets/TWRealFire.png" });
  }

  ngOnDestroy() {
    document.getElementById('searchInputs').querySelectorAll('input').forEach(input => input.value = '')
  }

  setFilter(filter) {
    if (this.filter === filter) {
      if (this.direction === 'desc') {
        this.direction = 'asc'
      } else {
        this.direction = 'desc'
      }
    } else {
      this.direction = 'asc'
      this.filter = filter
    }
    this.filterBy()
  }

  filterBy() {
    this.filteredBeasts = 'loading'
    let beastCopy = [...this.beasts]
    if (this.filter) {
      this.filteredBeasts = beastCopy.sort((a, b) => this.findSort(a, b, this.filter))
    } else {
      this.filteredBeasts = beastCopy
    }
  }

  findSort(a, b, key) {
    if (['conf', 'combat', 'skill', 'rarity'].includes(key)) {
      return this.sortbyNumber(a, b, this.filterDictionary[key])
    } else if (key === 'name') {
      return this.sortbyAlphabet(a, b, this.filterDictionary[key])
    }
    return this.sortBySize(a, b)
  }

  filterDictionary = {
    name: 'name',
    combat: 'maxcombat',
    conf: 'maxsocial',
    skill: 'maxskill',
    rarity: 'rarity'
  }

  sortbyNumber(a, b, key) {
    if (this.direction === 'asc') {
      if (a[key] < b[key]) {
        return -1;
      } else if (a[key] > b[key]) {
        return 1;
      }
    } else {
      if (a[key] < b[key]) {
        return 1;
      } else if (a[key] > b[key]) {
        return -1;
      }
    }
    return this.checkIfSpecial(a, b, key)
  }


  sortbyAlphabet(a, b, key) {
    const upperA = a[key].toUpperCase()
    const upperB = b[key].toUpperCase()
    if (this.direction === 'asc') {
      if (upperA < upperB) {
        return -1;
      } else if (upperA > upperB) {
        return 1;
      }
    } else {
      if (upperA < upperB) {
        return 1;
      } else if (upperA > upperB) {
        return -1;
      }
    }
    return 0
  }

  sortBySize(a, b) {
    const listToSortBy = ['Fine', 'Diminutive', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Giant', 'Enormous', 'Colossal']
    const aIndex = listToSortBy.indexOf(a.size)
    const bIndex = listToSortBy.indexOf(b.size)
    if (this.direction === 'asc') {
      if (aIndex < bIndex) {
        return -1;
      } else if (aIndex > bIndex) {
        return 1;
      }
    } else {
      if (aIndex < bIndex) {
        return 1;
      } else if (aIndex > bIndex) {
        return -1;
      }
    }
  }

  specialAttackDictionary = {
    maxcombat: 'hascombatattack',
    maxsocial: 'hasconfattack',
    maxskill: 'hasskillattack',
  }

  specialDefenseDictionary = {
    maxcombat: 'hascombatdefense',
    maxsocial: 'hasconfdefense',
    maxskill: 'hasskilldefense',
  }

  checkIfSpecial(a, b, key) {
    const attackKey = this.specialAttackDictionary[key]
    const defenseKey = this.specialDefenseDictionary[key]

    if (this.checkForAttack && this.checkForDefense) {
      if ((a[attackKey] && a[defenseKey]) && (!b[attackKey] || !b[defenseKey])) {
        return -1
      } else if ((b[attackKey] && b[defenseKey]) && (!a[attackKey] || !a[defenseKey])) {
        return 1
      }
    } else if (this.checkForAttack && !this.checkForDefense) {
      if (a[attackKey] && !b[attackKey]) {
        return -1;
      } else if (!a[attackKey] && b[attackKey]) {
        return 1;
      }
    } else if (this.checkForDefense && !this.checkForAttack) {
      if (a[defenseKey] && !b[defenseKey]) {
        return -1;
      } else if (!a[defenseKey] && b[defenseKey]) {
        return 1;
      }
    }
    return 0;
  }

  checkForSpecial(type) {
    if (type === 'A') {
      this.checkForAttack = !this.checkForAttack
    } else {
      this.checkForDefense = !this.checkForDefense
    }
    this.filterBy()
  }

  getRandom() {
    let { params } = this.currentRoute.snapshot
    let rarity
    if (!params.rarity) {
      rarity = this.getRarity();
    } else {
      rarity = params.rarity
    }
    this.adventureService.searchBeasts({ ...params, rarity }).subscribe(incomingBeasts => {
      const randomIndex = Math.floor(Math.random() * incomingBeasts.length)
      this.router.navigate(['/beast', incomingBeasts[randomIndex].id, 'gm']);
    })
  }

  getRarity() {
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

  formatPoints(min, max) {
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
    const beastidarray = this.beasts.map(beast => { return { beastid: +beast.id, rarity: beast.rarity } })
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

  addToQuickView(event, hash) {
    event.stopPropagation()
    if (hash) {
      this.quickViewService.addToQuickViewArray(hash)
    }
  }

  openNewTab(event, beastid) {
    event.stopPropagation()
    window.open('/beast/' + beastid + '/gm', '_blank');
  }
}
