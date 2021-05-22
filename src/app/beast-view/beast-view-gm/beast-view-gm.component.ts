import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
import { Title } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"

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

  public beast: any = {}
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public averageVitality = null
  public checkboxes = []
  public locationCheckboxes: any = {}
  public trauma = 0;
  public lairLoot = []
  public lairlootpresent = false

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      this.getRandomEncounter()

      this.locationCheckboxes.mainVitality = {
        average: this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      }
      this.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(this.locationCheckboxes.mainVitality.average)

      this.trauma = this.locationCheckboxes.mainVitality.average
      let { locationalvitality } = this.beast
      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({ location, vitality }) => {
          this.locationCheckboxes[location] = {
            average: this.calculatorService.calculateAverageOfDice(vitality)
          }
          this.trauma = Math.max(this.trauma, this.locationCheckboxes[location].average)
          this.locationCheckboxes[location].checkboxes = this.createCheckboxArray(this.locationCheckboxes[location].average)
        })
      }

      this.trauma = +(this.trauma / 2).toFixed(0);

      this.getLairLoot()
    })
  }

  getLairLoot() {
    this.lairLoot = []
    let { copper, silver, gold, relic, enchanted, potion, equipment, traited, scrolls, alms } = this.beast.lairloot

    this.lairlootpresent = copper || silver || gold || relic || enchanted || potion || equipment.length > 0 || traited > 0 || scrolls > 0 || alms > 0
    let { staticValues, numberAppearing, relicTable, traitedChance, traitDice, enchantedTable, scrollPower, almsFavor } = lootTables
      , { rollDice } = this.calculatorService

    if (relic) {
      let relicChance = Math.floor(Math.random() * 101);
      if (relicTable[relic].middling >= relicChance) {
        this.lairLoot.push("Middling Relic")
      } else if (relicTable[relic].minor >= relicChance) {
        this.lairLoot.push("Minor Relic")
      }
    }

    if (alms.length > 0) {
      for (let i = 0; i < alms.length; i++) {
        let favor = rollDice(almsFavor[alms[i].favor])
          , number = rollDice(numberAppearing[alms[i].number])
        if (number > 0) {
          this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
        }
      }
    }

    if (enchanted) {
      let enchantedChance = Math.floor(Math.random() * 101);
      if (enchantedTable[enchanted].middling >= enchantedChance) {
        this.lairLoot.push("Middling Enchanted Item")
      } else if (enchantedTable[enchanted].minor >= enchantedChance) {
        this.lairLoot.push("Minor Enchanted Item")
      }
    }

    if (potion) {
      let potionNumber = rollDice(numberAppearing[potion])
      if (potionNumber > 0) {
        this.lairLoot.push(`${potionNumber} potion${potionNumber > 1 ? 's' : ''}`)
      }
    }

    if (scrolls.length > 0) {
      for (let i = 0; i < scrolls.length; i++) {
        let power = rollDice(scrollPower[scrolls[i].power])
          , number = rollDice(numberAppearing[scrolls[i].number])
        if (number > 0) {
          this.lairLoot.push(`${number} scroll${number > 1 ? 's' : ''} (${power} SP)`)
        }
      }
    }

    if (traited.length > 0) {
      for (let i = 0; i < traited.length; i++) {
        let traitChance = Math.floor(Math.random() * 101)
          , table = traitedChance[traited[i].chancetable]
          , valueOfItem = staticValues[traited[i].value]
        for (let x = 0; x < table.length; x++) {
          if (traitChance <= table[x]) {
            let value = rollDice(valueOfItem)
            if (value > 0) {
              this.lairLoot.push(`Equipment (~${value} sc) w/ ${traitDice[x]} Trait`)
            }
            x = table.length
          }
        }
      }
    }

    if (equipment.length > 0) {
      for (let i = 0; i < equipment.length; i++) {
        let number = rollDice(numberAppearing[equipment[i].number])
        for (let x = 0; x < number; x++) {
          let value = rollDice(staticValues[equipment[i].value])
          if (value > 0) {
            this.lairLoot.push(`Equipment (~${value} sc)`)
          }
        }
      }
    }

    if (copper) {
      let copperNumber = rollDice(staticValues[copper]);
      if (copperNumber > 0) {
        this.lairLoot.push(copperNumber + " cc in coin")
      }
    }
    if (silver) {
      let silverNumber = rollDice(staticValues[silver]);
      if (silverNumber > 0) {
        this.lairLoot.push(silverNumber + " sc in coin")
      }
    }
    if (gold) {
      let goldNumber = rollDice(staticValues[gold]);
      if (goldNumber > 0) {
        this.lairLoot.push(goldNumber + " gc in coin")
      }
    }
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

    return (price / (this.beast.rarity / 2)).toFixed(1) + 'sc'
  }

  getUrl(id) {
    return `https://bestiary.dragon-slayer.net/beast/${id}/gm`
  }

}
