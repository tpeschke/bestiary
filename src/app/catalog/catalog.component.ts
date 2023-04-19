import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../util/services/beast.service'
import variables from '../../local.js'
import {Title, Meta} from "@angular/platform-browser";
import { QuickViewService } from '../util/services/quick-view.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private titleService: Title,
    private quickViewService: QuickViewService,
    private metaService: Meta
  ) { }

  public beasts = []
  public favorites: any = []
  public imageBase = variables.imageBase;
  public message = "You Don't Have Any Favorite Monsters Yet"

  isDisplayContextMenu: boolean;
  rightClickMenuPositionX: number;
  rightClickMenuPositionY: number;
  targetBeast: number;
  targetHash: string;
  targetRoles: any[];
  targetRole: string;
  targetSecondaryRole: string;
  targetSocialRole: string;
  targetSkillRole: string;
  targetSocialSecondary: string;
  targetDefaultRole: string
  public loggedIn:boolean|string|number = false;

  ngOnInit() {
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
    this.titleService.setTitle("Bestiary")
    this.metaService.updateTag( { name:'og:description', content: 'The Bestiary for the Bonfire TTRPG'});
    this.metaService.updateTag( { name:'og:image', content: "https://bestiary.dragon-slayer.net/assets/TWRealFire.png"});
    this.route.data.subscribe(data => {
      this.beasts = data['catalog']
    })
    this.beastService.getFavorites().subscribe((results:any) => {
      if (results.length > 0) {
        this.favorites = results
      } else if (results.message) {
        this.message = results.message
      }
    })
  }

  openNewTab() {
    window.open(window.location.href + 'beast/' + this.targetBeast + '/gm', '_blank');
  }

  addBeastToQuickView() {
    if (this.targetDefaultRole && this.targetRoles.length > 0) {
      for (let i = 0; i < this.targetRoles.length; i++) {
        if (this.targetRoles[i].id === this.targetDefaultRole) {
          this.quickViewService.addToQuickViewArray(this.targetRoles[i].hash)
          i == this.targetRoles.length
        }
      }
    } else {
      this.quickViewService.addToQuickViewArray(this.targetHash)
    }
  }

  addRoleToQuickView(index) {
    this.quickViewService.addToQuickViewArray(this.targetRoles[index].hash)
  }

  addRandomRoleToQuickView() {
    let randomIndex = Math.floor(Math.random() * this.targetRoles.length)
    this.quickViewService.addToQuickViewArray(this.targetRoles[randomIndex].hash)
  }

  displayContextMenu(event, beastid, hash, roles, role, secondaryrole, socialrole, skillrole, socialsecondary, defaultrole) {
    this.isDisplayContextMenu = true;
    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;
    this.targetBeast = beastid
    this.targetHash = hash
    this.targetRoles = roles
    this.targetRole = role
    this.targetSecondaryRole = secondaryrole
    this.targetSocialRole = socialrole
    this.targetSkillRole = skillrole
    this.targetSocialSecondary = socialsecondary
    this.targetDefaultRole = defaultrole
  }

  getRightClickMenuStyle() {
    let halfwayX = (window.innerWidth / 2)
    , divideX = this.rightClickMenuPositionX - halfwayX
    , toRight = divideX > 0
    , xOffsetStyling = {right: null, left: null}
    toRight ? xOffsetStyling.right = `${window.innerWidth - this.rightClickMenuPositionX - 5}px` : xOffsetStyling.left = `${this.rightClickMenuPositionX}px`


    let halfwayY = (window.innerHeight / 2)
    , divideY = this.rightClickMenuPositionY - halfwayY
    , toBottom = divideY > 0
    , yOffsetStyling = {bottom: null, top: null}
    toBottom ? yOffsetStyling.bottom = `${window.innerHeight - this.rightClickMenuPositionY - 5}px` : yOffsetStyling.top = `${this.rightClickMenuPositionY}px`

    return {
      position: 'fixed',
      zIndex: '99',
      boxShadow: '5px 5px 15px 5px rgba(0,0,0,0.32)',
      display: 'unset',
      ...xOffsetStyling,
      ...yOffsetStyling
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

  displayName(name, combatrole, secondarycombat, socialrole, skillrole, socialsecondary) {
    let nameString = ''
    let roles = false

    if (name) {
      nameString += name
    } else {
      name = ''
    }
    if (combatrole || socialrole || skillrole) {
      nameString += ' ['
      roles = true
    }
    if (combatrole) {
      nameString += `<img src="./assets/combaticon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${combatrole}`
      if (secondarycombat) {
        nameString += ` (${secondarycombat})`
      }
    }
    if (socialrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `<img src="./assets/socialicon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${socialrole}`
      if (socialsecondary) {
        nameString += ` (${socialsecondary})`
      }
    }
    if (skillrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `<img src="./assets/skillicon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${skillrole}`
    }

    if (roles) {
      nameString += ']'
    }

    if (nameString === '') {
      return ' Add to Quick View'
    }
    return nameString
  }

}
