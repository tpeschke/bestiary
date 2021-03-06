import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    private dialog: MatDialog,
    public router: Router
  ) { }

  public beast = { id: null, name: null, vitality: null, favorite: false, number_min: null, number_max: null }
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public averageVitality = null
  public checkboxes = []

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.getRandomEncounter()
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)

      let hurt = Math.floor(this.averageVitality * .25)
        , bloodied = Math.floor(this.averageVitality * .5)
        , wounded = Math.floor(this.averageVitality * .75)

      for (let i = 0; i < this.averageVitality; i++) {
        switch (i) {
          case hurt:
            this.checkboxes.push({ value: 'H' })
            break;
          case bloodied:
            this.checkboxes.push({ value: 'B' })
            break;
          case wounded:
            this.checkboxes.push({ value: 'W' })
            break;
          default:
            break;
        }
        this.checkboxes.push({ checked: false })
      }
    })
  }

  checkCheckbox(event, index) {
    this.checkboxes = this.checkboxes.map((box, i) => {
      if (box.value) {
        return box
      } else {
        if (i === 0 && index === 0) {
          return { checked: event.checked }
        } else if (i <= index) {
          return { checked: true }
        } else {
          return { checked: false }
        }
      }
    })
  }

  openExplaination() {
    this.dialog.open(HewyRatingComponent);
  }

  navigateToSearch(type, search) {
    this.router.navigate(['/search', { [type]: search }]);
  }

  isNumber(val): boolean { 
    return !isNaN(+val); 
  }

  addFavorite(beastid) {
    this.beastService.addFavorite(beastid).subscribe(result => {
      if (result.message === 'Monster Favorited') {
        this.beast.favorite = true
      }
    })
  }

  deleteFavorite(beastid) {
    this.beastService.deleteFavorite(beastid).subscribe(_ => {
      this.beast.favorite = false
    })
  }

  getRandomEncounter() {
    this.encounter = 'loading'
    this.beastService.getRandomEncounter(this.beast.id).subscribe((result: any) => {
      if (result.temperament) {
        result.rank.mainPlayers = result.rank.mainPlayers.map(player => {
          let number = this.calculatorService.rollDice(player.number)
          player.number = number > 0 ? number : 1
          return player
        })
        let distance = this.calculatorService.rollDice(result.rank.lair)

        if (result.complication) {
          result.complication.forEach(complication => {
            if (complication.id === 1) {
              if (complication.rival.number) {
                complication.rival.number = this.calculatorService.rollDice(complication.rival.number)
              } else {
                complication.rival.number = this.calculatorService.rollDice(`${complication.rival.number_min}d${complication.rival.number_max}`)
              }
            } else if (complication.id === 5) {
              distance = distance + this.calculatorService.rollDice(complication.distance)
            } else if (complication.id === 8) {
              complication.time = this.calculatorService.rollDice(complication.time) + " seconds"
              if (complication.backup.number) {
                complication.backup.number = this.calculatorService.rollDice(complication.backup.number)
              } else {
                complication.backup.number = this.calculatorService.rollDice(`${complication.backup.number_min}d${complication.rival.number_max}`)
              }
            }
          })
        }

        result.rank.lair = distance > 0 ? distance : 0
        result.timeOfDay = this.calculatorService.rollDice(12)
        let partOfDay = this.calculatorService.rollDice(2)
        result.timeOfDay += partOfDay === 1 ? " AM" : " PM";
      }
      this.encounter = result
    })
  }

  handleReagentPrice(harvest, difficulty) {
    let harvestAndDifficulty = this.calculatorService.calculateAverageOfDice(harvest + "+" + difficulty)
      , justDifficulty =this.calculatorService.calculateAverageOfDice(difficulty + "+" + difficulty)
    if (isNaN(harvestAndDifficulty) && !difficulty.includes("!") || !difficulty.includes("d")) {
      if (difficulty === '0') {
        return '10sc'
      } else {
        return difficulty;
      }
    } else if (isNaN(harvestAndDifficulty) && harvest !== 'n/a') {
      return justDifficulty + "0sc"
    } else if (isNaN(harvestAndDifficulty) && harvest === 'n/a') {
      return this.calculatorService.calculateAverageOfDice(difficulty) +'0sc'
    } else {
      return harvestAndDifficulty + '0sc'
    }
  }

  getUrl(id) {
    return `https://bestiary.dragon-slayer.net/beast/${id}/gm`
  }

}
