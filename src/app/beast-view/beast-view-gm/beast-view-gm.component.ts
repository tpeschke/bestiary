import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
import { Title } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"
import { QuickViewService } from 'src/app/util/services/quick-view.service';

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
    public titleService: Title,
    public quickViewService: QuickViewService
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
  public selectedRoleId = null;

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      this.getRandomEncounter()

      this.locationCheckboxes.mainVitality = {
        id: "mainVitality",
        average: this.calculatorService.rollDice(this.beast.vitality)
      }
      this.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(this.locationCheckboxes.mainVitality.average)

      for (const role in this.beast.roleInfo) {
        if (this.beast.roleInfo[role].vitality) {
          this.beast.roleInfo[role].average = this.calculatorService.rollDice(this.beast.roleInfo[role].vitality)
          this.beast.roleInfo[role].checkboxes = this.createCheckboxArray(this.beast.roleInfo[role].average)
          this.beast.roleInfo[role].trauma = +(this.beast.roleInfo[role].average / 2).toFixed(0);
        }
      }

      this.trauma = this.locationCheckboxes.mainVitality.average
      let { locationalvitality } = this.beast
      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({ location, vitality, id }) => {
          this.locationCheckboxes[id] = {
            location,
            average: this.calculatorService.rollDice(vitality)
          }
          this.trauma = Math.max(this.trauma, this.locationCheckboxes[id].average)
          this.locationCheckboxes[id].checkboxes = this.createCheckboxArray(this.locationCheckboxes[id].average)
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
              this.lairLoot.push(`Item (~${value} sc) w/ ${traitDice[x]} Trait`)
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
            this.lairLoot.push(`Item (~${value} sc)`)
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

    let bloodied = Math.floor(vitality * .25)
      , wounded = Math.floor(vitality * .5)
      , critical = Math.floor(vitality * .75)

    for (let i = 0; i < vitality; i++) {
      switch (i) {
        case bloodied:
          checkboxArray.push({ value: 'B' })
          break;
        case wounded:
          checkboxArray.push({ value: 'W' })
          break;
        case critical:
          checkboxArray.push({ value: 'C' })
          break;
        default:
          break;
      }
      checkboxArray.push({ checked: false })
    }
    return checkboxArray
  }

  checkCheckbox(event, index, id) {
    this.locationCheckboxes[id].checkboxes = this.locationCheckboxes[id].checkboxes.map((box, i) => {
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

  checkRoleCheckbox(event, index) {
    this.beast.roleInfo[this.selectedRoleId].checkboxes = this.beast.roleInfo[this.selectedRoleId].checkboxes.map((box, i) => {
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
        let dedupedArray = []
        , alreadyAddedRanks = []
        
        result.rank.mainPlayers.forEach(player => {
          let number = this.calculatorService.rollDice(player.number)
          number = number > 0 ? number : 1
          if (alreadyAddedRanks.indexOf(player.rank) === -1) {
            player.number = number
            dedupedArray.push(player)
            alreadyAddedRanks.push(player.rank)
          } else {
            for(let i = 0; i < dedupedArray.length; i++) {
              if (dedupedArray[i].rank === player.rank) {
                dedupedArray[i].number += number
              }
            }
          }
        })
        result.rank.mainPlayers = dedupedArray
        let distance = this.calculatorService.rollDice(result.rank.lair)

        if (result.complication) {
          result.complication.forEach(complication => {
            if (complication.id === 1) {
              if (complication.rival.number) {
                complication.rival.number = this.calculatorService.rollDice(complication.rival.number)
              } else {
                complication.rival.number = this.calculatorService.rollDice(`${complication.rival.number_min}d${complication.rival.number_max}`)
              }
              if (complication.rival.number < complication.rival.number_min) {
                complication.rival.number = complication.rival.number_min
              }
              if (complication.rival.number === 0) {
                complication.rival.number = 1
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

  getRarityModifier(rarity) {
    switch (+rarity) {
      case 1:
        return 'd20!';
      case 3:
        return 'd12!';
      case 5:
        return 'd6!';
      case 10:
        return '0';
      default:
        return ' nothing'
    }
  }

  setRole(event) {
    if (event.value) {
      this.selectedRoleId = event.value
    } else {
      this.selectedRoleId = null
    }
  }

  addToQuickView () {
    let hash = this.beast.hash
    if (this.selectedRoleId) {
      hash = this.beast.roleInfo[this.selectedRoleId].hash
    }
    this.quickViewService.addToQuickViewArray(hash)
  }

}
