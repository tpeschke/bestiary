import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { QuickViewService } from 'src/app/util/services/quick-view.service';
import roles from '../beast-view/roles.js'
import { MatExpansionPanel } from '@angular/material';
import { BeastService } from '../util/services/beast.service.js';
import { DisplayServiceService } from '../util/services/displayService.service.js';

@Component({
  selector: 'app-quick-view-drawer',
  templateUrl: './quick-view-drawer.component.html',
  styleUrls: ['./quick-view-drawer.component.css']
})
export class QuickViewDrawerComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  constructor(
    private beastService: BeastService,
    private router: Router,
    private quickViewService: QuickViewService,
    private displayService: DisplayServiceService
  ) { }

  private quickViewListIsOpen = false
  private isTrackedInCombatCounter = false
  private beasts = this.quickViewService.quickViewArray

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }

  public roles = roles.combatRoles.primary;

  public newSelectedWeapon;
  public newWeaponInfo;
  public newSelectedArmor;
  public newArmorInfo
  public newSelectedShield;
  public newShieldInfo;
  public showAllEquipment;

  ngOnInit() {}

  toggleQuickViewList() {
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
    })

    this.quickViewListIsOpen = !this.quickViewListIsOpen
    if (!this.quickViewListIsOpen) {
      this.viewPanels.forEach(p => p.close());
    }
  }

  isNumber(val): boolean {
    return !isNaN(+val);
  }

  addAnotherVitality(beastIndex) {
    this.quickViewService.addAnotherVitalityToBeast(beastIndex)
  }

  removeVitality(beastIndex, vitalityIndex) {
    this.quickViewService.removeVitalityFromBeast(beastIndex, vitalityIndex)
  }

  trackedInCombatCounter(event) {
    this.isTrackedInCombatCounter = event.checked
  }

  goToEntry(beastId) {
    this.router.navigate([`/beast/${beastId}/gm`])
    this.quickViewListIsOpen = false;
  }

  toggleEquipmentSelection = (square, beast, beastIndex) => {
    if (!square.showEquipmentSelection) {
      this.newSelectedWeapon = square.selectedweapon
      this.newWeaponInfo = square.weaponInfo
      this.newWeaponInfo.weapontype = square.weapontype
      this.newSelectedArmor = square.selectedarmor
      this.newArmorInfo = square.armorInfo
      this.newSelectedShield = square.selectedshield
      this.newShieldInfo = square.shieldInfo
      // this.showAllEquipment = this.displayService.turnOnAllEquipment(beast.roleinfo, this.newSelectedWeapon, this.newSelectedArmor, this.newSelectedShield)
    } else if (square.showEquipmentSelection) {
      square.selectedweapon = this.newSelectedWeapon

      square.weaponInfo = this.newWeaponInfo
      if (square.weaponInfo.range) {
        square.weapontype = 'r'
        if (!square.ranges) {
          square.ranges = { increment: 0 }
        }
      } else {
        square.weapontype = 'm'
      }
      square.selectedarmor = this.newSelectedArmor
      square.armorInfo = this.newArmorInfo
      square.selectedshield = this.newSelectedShield
      square.shieldInfo = this.newShieldInfo
    }
    square.showEquipmentSelection = !square.showEquipmentSelection
  }

  backoutOfEquipmentSelection = (square) => {
    this.newSelectedWeapon = null
    this.newWeaponInfo = null
    this.newSelectedArmor = null
    this.newArmorInfo = null
    this.newSelectedShield = null
    this.newShieldInfo = null
    this.showAllEquipment = false
    square.showEquipmentSelection = false
  }

  captureEquipmentChange = ({ value }, type) => {
    if (value === 'None') { value = null }
    if (type === 'selectedweapon') {
      this.newSelectedWeapon = value
      this.newWeaponInfo = this.equipmentObjects.weapons[value]
      if (this.newWeaponInfo && this.newWeaponInfo.range) {
        this.newWeaponInfo.weapontype = 'r'
      } else if (this.newWeaponInfo) {
        this.newWeaponInfo.weapontype = 'm'
      } else {
        this.newWeaponInfo = { weapontype: 'm' }
      }
    } else if (type === 'selectedarmor') {
      this.newSelectedArmor = value
      this.newArmorInfo = this.equipmentObjects.armor[value]
    } else if (type === 'selectedshield') {
      this.newSelectedShield = value
      this.newShieldInfo = this.equipmentObjects.shields[value]
    }
  }

  

  checkShowAllEquipment = (checked) => {
    this.showAllEquipment = checked
  }
}
