import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
import { Title } from "@angular/platform-browser";

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
    public router: Router,
    public titleService: Title
  ) { }

  public beast = { id: null, name: null, vitality: null, favorite: false, number_min: null, number_max: null, rarity: null, locationalvitality: [] }
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public averageVitality = null
  public checkboxes = []
  public locationCheckboxes: any = {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      this.getRandomEncounter()

      this.locationCheckboxes.mainVitality = {
        average: this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      }
      this.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(this.locationCheckboxes.mainVitality.average)

      let {locationalvitality} = this.beast
      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({location, vitality})=> {
          this.locationCheckboxes[location] = {
            average: this.calculatorService.calculateAverageOfDice(vitality)
          }
          this.locationCheckboxes[location].checkboxes = this.createCheckboxArray(this.locationCheckboxes[location].average)
        })
      }
    })
  }

  createCheckboxArray(vitality) {
    let checkboxArray = []

    let hurt = Math.floor(vitality * .25)
      , bloodied = Math.floor(vitality * .5)
      , wounded = Math.floor(vitality * .75)

    for (let i = 0; i < vitality; i++) {
      switch (i) {
        case hurt:
          checkboxArray.push({ value: 'H' })
          break;
        case bloodied:
          checkboxArray.push({ value: 'B' })
          break;
        case wounded:
          checkboxArray.push({ value: 'W' })
          break;
        default:
          break;
      }
      checkboxArray.push({ checked: false })
    }
    return checkboxArray
  }

  checkCheckbox(event, index, location) {
    this.locationCheckboxes[location].checkboxes = this.locationCheckboxes[location].checkboxes.map((box, i) => {
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
      , justDifficulty = this.calculatorService.calculateAverageOfDice(difficulty + "+" + difficulty)
      , price;
    if (isNaN(harvestAndDifficulty) && !difficulty.includes("!") || !difficulty.includes("d")) {
      if (difficulty === '0') {
        price = 10
      } else {
        price = difficulty;
      }
    } else if (isNaN(harvestAndDifficulty) && harvest !== 'n/a') {
      price = justDifficulty * 10
    } else if (isNaN(harvestAndDifficulty) && harvest === 'n/a') {
      price = this.calculatorService.calculateAverageOfDice(difficulty) * 10
    } else {
      price = harvestAndDifficulty * 10
    }

    return (price / (this.beast.rarity / 2)) + 'sc'
  }

  getUrl(id) {
    return `https://bestiary.dragon-slayer.net/beast/${id}/gm`
  }

}
