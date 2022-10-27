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

  ngOnInit() {
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
    this.quickViewService.addToQuickViewArray(this.targetHash)
  }

  addRoleToQuickView(index) {
    this.quickViewService.addToQuickViewArray(this.targetRoles[index].hash)
  }

  addRandomRoleToQuickView() {
    let randomIndex = Math.floor(Math.random() * this.targetRoles.length)
    this.quickViewService.addToQuickViewArray(this.targetRoles[randomIndex].hash)
  }

  displayContextMenu(event, beastid, hash, roles, role, secondaryrole, socialrole, skillrole) {
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
  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
      zIndex: '99'
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

  displayName(name, combatrole, secondarycombat, socialrole, skillrole) {
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
        nameString += `(${secondarycombat})`
      }
    }
    if (socialrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `<img src="./assets/socialicon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${socialrole}`
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
