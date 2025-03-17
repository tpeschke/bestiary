import { Component, OnInit, Input } from '@angular/core';
import { Size } from 'aws-sdk/clients/cloudsearchdomain';
import { BeastService } from 'src/app/util/services/beast.service';

@Component({
  selector: 'app-combat-display',
  templateUrl: './combat-display.component.html',
  styleUrls: ['../../beast-view.component.css', './combat-display.component.css']
})
export class CombatDisplayComponent implements OnInit {
  @Input() beastInfo: any;
  // Vitality & Fatigue
  @Input() physical: any;
  @Input() checkStat: Function;
  @Input() checkCheckBox: Function;
  @Input() captureBasicInput: Function;
  @Input() checkTrauma: Function;
  @Input() captureSliderInput: Function;
  @Input() captureInput: Function;
  @Input() checkAllRoles: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() addNewSecondaryItem: Function;
  // Defense
  @Input() beast: any;
  @Input() captureHTML: Function;
  @Input() roleInfo: any;
  @Input() removeTable: Function;
  @Input() addNewTable: Function;
  @Input() defenses: any;
  // Attack
  // As Defense +
  @Input() attacks: any;
  @Input() selectedRoleId: any;
  @Input() combatStatArray: any;
  @Input() points: any;
  @Input() setVitalityAndStress: Function;
  @Input() size: Size;
  @Input() secondaryrole: any;
  @Input() removeCombatStatFromArray: Function
  // & addNewSecondaryItem
  // Movement
  @Input() movement: any;
  @Input() selectedRole: any;
  @Input() checkMovementStat: Function;
  @Input() getAdjustment: Function;
  // & selectedRoleId
  // & captureInput
  // & checkAllRoles
  // & removeNewSecondaryItem
  // & addNewSecondaryItem

  constructor(
    public beastService: BeastService
  ) { }

  public sectionToDisplay = null

  public sizeDictionary = {
    Fine: 1,
    Diminutive: 5,
    Tiny: 5,
    Small: 10,
    Medium: 15,
    Large: 20,
    Huge: 35,
    Giant: 55,
    Enormous: 90,
    Colossal: 145
  }

  public defenseArray = []
  public attackArray = []

  ngOnInit() {
    this.defenses.forEach((defense, index) => {
      this.setDefenseInfo(index)
    })
    this.attacks.forEach((attack, index) => {
      this.setAttackInfoUnbound(index)
    })
  }

  setSectionToDisplay(sectionToDisplay) {
    if (this.sectionToDisplay === sectionToDisplay) {
      this.sectionToDisplay = null
    } else {
      this.sectionToDisplay = sectionToDisplay
    }
  }

  setDefenseInfoUnbound(index) {
    this.beastService.getCombatSquare(this.defenses[index], this.beastInfo.role, this.points, this.size).subscribe(res => {
      this.defenseArray[index] = res
    })
  }
  setDefenseInfo = this.setDefenseInfoUnbound.bind(this)

  setAttackInfoUnbound(index) {
    this.beastService.getCombatSquare(this.attacks[index], this.beastInfo.role, this.points, this.size).subscribe(res => {
      this.attackArray[index] = res
      console.log(this.attackArray)
    })
  }
  setAttackInfo = this.setAttackInfoUnbound.bind(this)

}