import { Injectable } from '@angular/core';
import { BeastService } from './beast.service';
import { CalculatorService } from './calculator.service';

@Injectable({
  providedIn: 'root'
})
export class QuickViewService {

  constructor(
    private beastService: BeastService,
    private calculatorService: CalculatorService
  ) { }

  public quickViewArray: any = [];

  addToQuickViewArray(beastid) {
    this.beastService.getQuickView(beastid).subscribe(results => {
      results = this.modifyVitality(results)
      results.vitalityArray = []
      results.vitalityArray.push({ locationCheckboxes: results.locationCheckboxes, label: "" })
      this.quickViewArray.push(results)
      this.beastService.handleMessage({ message: `${results.name} have been added to your quick view`, color: "green" })
    })
  }

  modifyVitality(monster) {
    monster.locationCheckboxes = { mainVitality: {} }
    monster.locationCheckboxes.mainVitality = {
      average: this.calculatorService.rollDice(monster.vitality)
    }
    monster.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(monster.locationCheckboxes.mainVitality.average, monster.panic)

    monster.trauma = monster.locationCheckboxes.mainVitality.average
    let { locationalvitality } = monster
    if (locationalvitality.length > 0) {
      locationalvitality.forEach(({ location, vitality }) => {
        monster.locationCheckboxes[location] = {
          average: this.calculatorService.rollDice(vitality)
        }
        monster.trauma = Math.max(monster.trauma, monster.locationCheckboxes[location].average)
        monster.locationCheckboxes[location].checkboxes = this.createCheckboxArray(monster.locationCheckboxes[location].average)
      })
    }

    monster.trauma = +(monster.trauma / 2).toFixed(0);
    return monster
  }

  createCheckboxArray(vitality, panic = 7) {
    let checkboxArray = []
    let isPanicked = panic <= 2

    let bloodied = Math.floor(vitality * .25)
      , wounded = Math.floor(vitality * .5)
      , critical = Math.floor(vitality * .75)

    for (let i = 0; i < vitality; i++) {
      switch (i) {
        case bloodied:
          isPanicked = panic <= 3
          checkboxArray.push({ value: 'B', isPanicked })
          break;
        case wounded:
          isPanicked = panic <= 4
          checkboxArray.push({ value: 'W', isPanicked })
          break;
        case critical:
          isPanicked = panic <= 5
          checkboxArray.push({ value: 'C', isPanicked })
          break;
        default:
          break;
      }
      checkboxArray.push({ checked: false, isPanicked })
    }
    return checkboxArray
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
