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

  addToQuickViewArray (beastid) {
    this.beastService.getQuickView(beastid).subscribe(results => {
      results = this.modifyVitality(results)
      results.vitalityArray = []
      results.vitalityArray.push({locationCheckboxes: results.locationCheckboxes, label: ""})
      this.quickViewArray.push(results)
      this.beastService.handleMessage({message: `${results.name} have been added to your quick view`, color: "green"})
    })
  }

  modifyVitality (monster) {
    monster.locationCheckboxes = {mainVitality: {}}
    monster.locationCheckboxes.mainVitality = {
      average: this.calculatorService.rollDice(monster.vitality)
    }
    monster.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(monster.locationCheckboxes.mainVitality.average)

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

  createCheckboxArray(vitality) {
    let checkboxArray = []

    let hurt = Math.floor(vitality * .25)
      , bloodied = Math.floor(vitality * .5)
      , wounded = Math.floor(vitality * .75)

    for (let i = 0; i < vitality; i++) {
      switch (i) {
        case hurt:
          checkboxArray.push({ value: 'B' })
          break;
        case bloodied:
          checkboxArray.push({ value: 'W' })
          break;
        case wounded:
          checkboxArray.push({ value: 'C' })
          break;
        default:
          break;
      }
      checkboxArray.push({ checked: false })
    }
    return checkboxArray
  }

  addAnotherVitalityToBeast(beastIndex) {
    let newMonsterVitality = this.modifyVitality(this.quickViewArray[beastIndex])
    this.quickViewArray[beastIndex].vitalityArray.push({locationCheckboxes: newMonsterVitality.locationCheckboxes, label: ""})
  }

  removeVitalityFromBeast(beastIndex, vitalityIndex) {
    this.quickViewArray[beastIndex].vitalityArray.splice(vitalityIndex, 1)
  }
}
