import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-combat-table',
  templateUrl: './combat-table.component.html',
  styleUrls: ['./combat-table.component.css']
})
export class CombatTableComponent implements OnInit {
  @Input() combatSquare: any
  @Input() editing: boolean
  @Input() increaseInitiative: Function
  @Input() selectedEntryIndex: any
  @Input() selectedVitalityIndex: any

  constructor() { }

  public isMelee = true
  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.combatSquare) {
      this.isMelee = changes.combatSquare.currentValue.weaponType === 'm'
    }
  }

  formatEquipmentBonuses () {
    let returnString = ''
    if (this.combatSquare.equipmentBonuses.weaponInfo) {
      returnString += this.combatSquare.equipmentBonuses.weaponInfo
    }
    if (this.combatSquare.equipmentBonuses.shieldInfo) {
      returnString += this.combatSquare.equipmentBonuses.shieldInfo
    }
    if (this.combatSquare.equipmentBonuses.armorInfo) {
      returnString += this.combatSquare.equipmentBonuses.armorInfo
    }

    return returnString
  }

}
