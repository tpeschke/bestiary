import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatCheckbox, MatExpansionPanel } from '@angular/material';
import { BeastService } from '../../util/services/beast.service';

class QueryObject {
  name?: string
  body?: string
  minHr?: string
  maxHr?: string
  minInt?: string
  maxInt?: string
  size?: string
  access?: number
  subsystem?: number
  personalNotes?: boolean
  anyaccess?: boolean
  climate?: any
  types?: any
  roles?: any
  rarity?: any
}
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChildren(MatCheckbox) checkBoxes: QueryList<MatCheckbox>;
  
  constructor(
    public router: Router,
    public beastService: BeastService
  ) { }

  public queryObject: QueryObject = {}
  public climate = []
  public types = []
  public roles = []

  public climateList = [
    {id: 1, code: 'Af', climate: 'Tropical Rainforest', examples: 'Indonesia, Colombia, North DRC'},
    {id: 2, code: 'Am', climate: 'Tropical Monsoon', examples: 'Northern Brazil, Thailand Coast, Congo'},
    {id: 3, code: 'Aw/As', climate: 'Tropical Savanna', examples: 'Ivory Coast, Central India, Southern Brazil'},
    {id: 4, code: 'BWh', climate: 'Hot Desert', examples: 'The Sahara'},
    {id: 5, code: 'BWk', climate: 'Cold Desert', examples: 'Atacama Desert, Katpana Desert'},
    {id: 6, code: 'BSh', climate: 'Hot Semi-Arid', examples: 'The Outback'},
    {id: 7, code: 'BSk', climate: 'Cold Semi-Arid', examples: 'Spain, Western US'},
    {id: 8, code: 'Csa', climate: 'Hot-Summer Mediterranean', examples: 'Anatolia, Iran'},
    {id: 9, code: 'Csb', climate: 'Warm-Summer Mediterranean', examples: 'NW Iberian Peninsula, Coastal California'},
    {id: 10, code: 'Csc', climate: 'Cold-Summer Mediterranean', examples: 'Cascadia, Sierra Nevada'},
    {id: 11, code: 'Cwa', climate: 'Monsoon Humid Subtropical', examples: 'Southern US, Southern China'},
    {id: 12, code: 'Cwb', climate: 'Subtropical Highland', examples: 'Guatemala, Lesotho'},
    {id: 13, code: 'Cfb', climate: 'Temperate Oceanic', examples: 'New Zealand, Lyon'},
    {id: 14, code: 'Dsa', climate: 'Mediterranean Hot-Summer Humid', examples: 'Iran, Kyrgyzstan, Utah'},
    {id: 15, code: 'Dsb', climate: 'Warm-Summer Continental', examples: 'Iran, Armenia, South Finland, Ukraine'},
    {id: 16, code: 'Dsc', climate: 'Mediterranean Subartic', examples: 'Iceland, Chile, Norway, Washington'},
    {id: 17, code: 'Dsd', climate: 'Mediterranean Freezing Subartic', examples: 'Russia'},
    {id: 18, code: 'Dwa', climate: 'Monsoon Hot-Summer Humid', examples: 'South Korea, China, Nebraska'},
    {id: 19, code: 'Dwb', climate: 'Monsoon Warm-Summer Humid', examples: 'Mongolia, Calgary, Irkutsk'},
    {id: 20, code: 'Dwc', climate: 'Monsoon Subartic, Russia, Alaska'},
    {id: 21, code: 'Dwd', climate: 'Monsoon Freezing Subartic', examples: 'Russia'},
    {id: 22, code: 'Dfa', climate: 'Hot-Summer Humid Continental', examples: 'Kazakhstan, Chicago, Ontario'},
    {id: 23, code: 'Dfb', climate: 'Warm-Summer Humid Continental', examples: 'Chamonix, Alberta, Quebec'},
    {id: 24, code: 'Dfc', climate: 'Subartic', examples: 'Norway, Russia, Alaska, Greenland'},
    {id: 25, code: 'Dfd', climate: 'Freezing Subartic', examples: 'Sakha Republic'},
    {id: 26, code: 'ET', climate: 'Tundra', examples: 'Crozet Islands, Denmark, Iceland'},
    {id: 27, code: 'EF', climate: 'Ice Cap', examples: 'Antarctica, Greenland'},
    {id: 28, code: null, climate: 'Salt-Water Sea', examples: 'Caspian, Black Sea'},
    {id: 29, code: null, climate: 'Salt-Water Ocean', examples: 'Atlantic, Pacific'},
    {id: 30, code: null, climate: 'Salt-Water Lake', examples: 'Salt Lake, Chott el Djerid'},
    {id: 31, code: null, climate: 'Salt-Water River', examples: 'Pecos River'},
    {id: 32, code: null, climate: 'Fresh-Water Sea', examples: 'Sea of Galilee'},
    {id: 33, code: null, climate: 'Fresh-Water Lake', examples: 'Lake Superior, Lake Victoria'},
    {id: 34, code: null, climate: 'Fresh-Water River', examples: 'The Nile, The Amazon'},
    {id: 35, code: null, climate: 'Fresh-Water Glacier', examples: 'Bering Glacier, Jostedalsbreen'},
    {id: 36, code: null, climate: 'Urban', examples: 'London, Aachen, Milan'},
    {id: 37, code: null, climate: 'Urban Sewer', examples: 'Cloaca Maxima, the Sewers of Paris'},
    {id: 38, code: null, climate: 'Ship', examples: 'Flor de la Mar, Mary Rose, Sao Gabriel'},
    {id: 39, code: null, climate: 'Dungeon', examples: 'The Xanthic Hold, Conjuror\'s Tower'},
    {id: 40, code: null, climate: 'Castle', examples: 'Neuschwanstein, Caernarfon, Bodiam'},
    {id: 41, code: null, climate: 'Ruin', examples: 'Anything the Romans built'}
  ]


  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!event.url.includes('search')) {
          this.climate = []
          this.types = []
          this.roles = []
          this.queryObject = {}
          this.viewPanels.forEach(p => p.close());
          this.checkBoxes.forEach(p => p.checked = false)
        }
      }
    });
  }

  enterSearchName(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, name: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, name: e.target.value }]);
    } else if (e.value===undefined || e.target.value === '') {
      delete this.queryObject.name
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchBody(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, body: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, body: e.target.value }]);
    } else if (e.target.value === undefined || e.target.value === '') {
      delete this.queryObject.body
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterRating(e, type) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, [type]: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, [type]: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject[type]
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchMaxHr(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, maxHr: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, maxHr: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.maxHr
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchMinInt(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, minInt: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, minInt: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.minInt
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchMaxInt(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, maxInt: e.target.value }
      this.router.navigate(['/search', { ...this.queryObject, maxInt: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.maxInt
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchSize(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, size: e.value }
      this.router.navigate(['/search', { ...this.queryObject, size: e.value }]);
    } else if (e.value===undefined) {
      delete this.queryObject.size
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchRarity(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, rarity: e.value }
      this.router.navigate(['/search', { ...this.queryObject, rarity: e.value }]);
    } else if (e.value===undefined) {
      delete this.queryObject.rarity
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchAccess(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, access: +e.value }
      this.router.navigate(['/search', { ...this.queryObject }]);
    } else if (e.value===undefined) {
      delete this.queryObject.access
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchSubsystem(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, subsystem: +e.value }
      this.router.navigate(['/search', { ...this.queryObject }]);
    } else if (e.value===undefined) {
      delete this.queryObject.subsystem
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchPersonalNotes(e) {
    if (e.checked) {
      this.queryObject = { ...this.queryObject, personalNotes: e.checked }
      this.router.navigate(['/search', { ...this.queryObject, personalNotes: e.checked }]);
    } else {
      delete this.queryObject.personalNotes
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }
  
  searchByAnyAccess(e) {
    if (e.checked) {
      this.queryObject = { ...this.queryObject, anyaccess: e.checked }
      this.router.navigate(['/search', { ...this.queryObject, anyaccess: e.checked }]);
    } else {
      delete this.queryObject.anyaccess
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchTypes(id, e) {
    if (e.checked) {
      this.types.push(id)
    } else {
      let index = this.types.indexOf(id)
      this.types.splice(index, 1)
    }
    if (this.types.length === 0) {
      delete this.queryObject.types
      this.router.navigate(['/search', { ...this.queryObject }]);
    } else {
      this.queryObject = { ...this.queryObject, types: this.types }
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchRoles(id, e) {
    if (e.checked) {
      this.roles.push(id)
    } else {
      let index = this.roles.indexOf(id)
      this.roles.splice(index, 1)
    }
    if (this.roles.length === 0) {
      delete this.queryObject.roles
      this.router.navigate(['/search', { ...this.queryObject }]);
    } else {
      this.queryObject = { ...this.queryObject, roles: this.roles }
      this.router.navigate(['/search', { ...this.queryObject }]);
    }
  }

  enterSearchClimate(id, e) {
    if (e.checked) {
      this.climate.push(id)
    } else {
      let index = this.climate.indexOf(id)
      this.climate.splice(index, 1)
    }
    if (this.climate.length === 0) {
      delete this.queryObject.climate
      this.router.navigate(['/search', { ...this.queryObject }]);
    } else {
      this.queryObject = { ...this.queryObject, climate: this.climate }
      this.router.navigate(['/search', { ...this.queryObject, climate: this.climate }]);
    }
  }

  getRandom() {
    this.beastService.getRandomMonster().subscribe(beastid => {
      this.router.navigate(['/beast', beastid.id, 'gm']);
    })
  }
}
