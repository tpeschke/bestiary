import { Injectable } from '@angular/core';
import { BeastService } from './beast.service';
import { CalculatorService } from './calculator.service';
import roles from '../../beast-view/roles.js'

@Injectable({
  providedIn: 'root'
})
export class QuickViewService {

  constructor(
    private beastService: BeastService,
    private calculatorService: CalculatorService
  ) { }

  public quickViewArray: any = [];
  public combatRolesInfo = roles.combatRoles.primary

  addToQuickViewArray(hash, body = null) {
    this.beastService.getQuickView(hash, body).subscribe(results => {
      if (!results.color) {
        results.vitalityArray = []
        if (results.role) {
          results.roleinfo = this.combatRolesInfo[results.role]
        }
        this.quickViewArray.push(results)
        this.addAnotherVitalityToBeast(this.quickViewArray.length - 1)
        this.quickViewArray.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          }
          return 0;
        })
        this.beastService.handleMessage({ message: `${results.name} have been added to your quick view`, color: "green" })
      }
    })
  }

  removeFromQuickView(index) {
    this.quickViewArray.splice(index, 1)
  }

  addAnotherVitalityToBeast(beastIndex) {
    let diceToRoll = this.quickViewArray[beastIndex].phyiscalAndStress.physical.diceString
    if (diceToRoll.includes('(KB')) {
      diceToRoll = diceToRoll.split('(')[0]
    }
    const vitality = this.calculatorService.rollDice(diceToRoll)
    let trauma: any = +((this.quickViewArray[beastIndex].phyiscalAndStress.physical.largeweapons / 2).toFixed(0))
    if (this.quickViewArray[beastIndex].notrauma) {
      trauma = 'N/A'
    }
    let locationalvitalities = null
    if (this.quickViewArray[beastIndex].locationalvitality) {
      locationalvitalities = []
      this.quickViewArray[beastIndex].locationalvitality.forEach(({location, currentDamage, vitality}) => {
        locationalvitalities.push({location, currentDamage, vitality: this.calculatorService.rollDice(vitality)})
      })
      this.quickViewArray[beastIndex].locationalvitalities = locationalvitalities
    }
    this.quickViewArray[beastIndex].vitalityArray.push({ vitality, trauma, label: "", initiative: 0 })
  }

  removeVitalityFromBeast(beastIndex, vitalityIndex) {
    this.quickViewArray[beastIndex].vitalityArray.splice(vitalityIndex, 1)
  }

  setInitiative = (newSecond, beastIndex, mainIndex) => {
    this.quickViewArray[beastIndex].vitalityArray[mainIndex].initiative = +newSecond
  }

  increaseInitiative = (seconds, beastIndex, mainIndex) => {
    this.quickViewArray[beastIndex].vitalityArray[mainIndex].initiative += +seconds
  }

  checkCheckbox(event, index, location, beastIndex, vitalityIndex) {
    this.quickViewArray[beastIndex].vitalityArray[vitalityIndex].locationCheckboxes[location].checkboxes = this.quickViewArray[beastIndex].vitalityArray[vitalityIndex].locationCheckboxes[location].checkboxes.map((box, i) => {
      if (box.value) {
        return box
      } else {
        if (i === 0 && index === 0) {
          return { ...box, checked: event.checked }
        } else if (i <= index) {
          return { ...box, checked: true }
        } else {
          return { ...box, checked: false }
        }
      }
    })
  }
}
