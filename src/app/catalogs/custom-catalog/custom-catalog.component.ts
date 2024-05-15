import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../../util/services/beast.service'
import variables from '../../../local.js'
import { Title } from "@angular/platform-browser";
import { QuickViewService } from '../../util/services/quick-view.service';
import { MatDialog } from '@angular/material';
import { AddToListPopUpComponent } from '../../random-encounters/add-to-list-pop-up/add-to-list-pop-up.component';

@Component({
  selector: 'app-custom-catalog',
  templateUrl: './custom-catalog.component.html',
  styleUrls: ['./custom-catalog.component.css', '../catalog/catalog.component.css']
})
export class CustomCatalogComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private titleService: Title,
    private dialog: MatDialog,
    private quickViewService: QuickViewService,
  ) { }

  public beasts = []
  public isLoading = true
  public favorites: any = []
  public imageBase = variables.imageBase;

  isDisplayContextMenu: boolean;
  rightClickMenuPositionX: number;
  rightClickMenuPositionY: number;
  targetBeast: number;
  targetRarity;
  targetName: string;
  targetHash: string;
  targetRoles: any[];
  targetRole: string;
  targetSecondaryRole: string;
  targetSocialRole: string;
  targetSkillRole: string;
  targetSocialSecondary: string;
  targetDefaultRole: string
  targetHasToken: any = false
  public loggedIn: any = false;

  ngOnInit() {
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
    this.titleService.setTitle("Custom Catalog")
    this.beastService.getCustomCatalog().subscribe(data => {
      this.beasts = data
      this.isLoading = false
    })
  }

  onImageError (event, imagesource, imageBase) {
    event.target.onerror = null;
    if (imagesource) {
      event.target.src = imageBase + imagesource
    } else {
      event.target.src = '/assets/404.png';
    }
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

  displayContextMenu(event, beastid, name, hash, roles, role, secondaryrole, socialrole, skillrole, socialsecondary, defaultrole, rarity) {
    this.isDisplayContextMenu = true;
    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;
    this.targetBeast = beastid
    this.targetName = name
    this.targetHash = hash
    this.targetRoles = roles
    this.targetRole = role
    this.targetSecondaryRole = secondaryrole
    this.targetSocialRole = socialrole
    this.targetSkillRole = skillrole
    this.targetSocialSecondary = socialsecondary
    this.targetDefaultRole = defaultrole
    this.targetHasToken = false
    this.targetRarity = rarity
    this.beastService.checkToken(beastid).subscribe(res => {
      this.targetHasToken = res
    })
  }

  forceDownload() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + this.targetBeast + '-token', true);
    xhr.responseType = "blob";
    const beastName = this.targetName
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = beastName + '.png';
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }

  stopProp(event) {
    event.stopPropagation()
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

  openRandomListsPopUp() {
    this.dialog.open(AddToListPopUpComponent, { width: '400px', data: {beastid: this.targetBeast} });
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
    this.targetHasToken = false
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
