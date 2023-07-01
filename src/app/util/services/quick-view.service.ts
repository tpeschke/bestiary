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

  addToQuickViewArray(hash) {
    this.beastService.getQuickView(hash).subscribe(results => {
      results = this.modifyVitality(results)
      results.vitalityArray = []
      results.vitalityArray.push({ locationCheckboxes: results.locationCheckboxes, label: "" })
      results.averageVitality = results.vitalityArray[0].locationCheckboxes.mainVitality.average
      if (results.role) {
        results.roleinfo = this.combatRolesInfo[results.role]
      }
      this.quickViewArray.push(results)
      this.beastService.handleMessage({ message: `${results.name} have been added to your quick view`, color: "green" })
    })
  }

  removeFromQuickView(index) {
    this.quickViewArray.splice(index, 1)
  }

  modifyVitality(monster) {
    monster.locationCheckboxes = { mainVitality: {} }
    monster.locationCheckboxes.mainVitality = {
      rolled: this.calculatorService.rollDice(monster.vitality),
      average: this.calculatorService.calculateAverageOfDice(monster.vitality)
    }
    if (monster.secondaryrole === 'Fodder') {
      monster.locationCheckboxes.mainVitality.rolled = Math.ceil(monster.locationCheckboxes.mainVitality.rolled / 2)
      monster.locationCheckboxes.mainVitality.average = Math.ceil(monster.locationCheckboxes.mainVitality.average / 2)
    }
    monster.trauma = monster.locationCheckboxes.mainVitality.average
    monster.trauma = +(monster.trauma / 2).toFixed(0);

    let { locationalvitality } = monster
    if (locationalvitality.length > 0) {
      locationalvitality.forEach(({ location, vitality }) => {
        monster.locationCheckboxes[location] = {
          rolled: this.calculatorService.rollDice(vitality)
        }
        monster.trauma = Math.max(monster.trauma, monster.locationCheckboxes[location].average)
      })
    }

    return monster
  }

  addAnotherVitalityToBeast(beastIndex) {
    let newMonsterVitality = this.modifyVitality(this.quickViewArray[beastIndex])
    this.quickViewArray[beastIndex].vitalityArray.push({ locationCheckboxes: newMonsterVitality.locationCheckboxes, label: "" })
  }

  removeVitalityFromBeast(beastIndex, vitalityIndex) {
    this.quickViewArray[beastIndex].vitalityArray.splice(vitalityIndex, 1)
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
