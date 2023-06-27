import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { Title, Meta } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"
import { QuickViewService } from 'src/app/util/services/quick-view.service';
import { primaryTables, secondaryTables } from './firbolg-tables'
import { demonIds, tables as demonTables } from './demon-tables'
import roles from '../roles.js'
import { DisplayServiceService } from 'src/app/util/services/displayService.service';
import { MatDialog } from '@angular/material';
import { ChallengePopUpComponent } from '../../obstacle-index/view/challenge-pop-up/challenge-pop-up.component'

@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['../beast-view.component.css', './beast-view-gm.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    public router: Router,
    public titleService: Title,
    public quickViewService: QuickViewService,
    public metaService: Meta,
    public displayService: DisplayServiceService,
    private dialog: MatDialog,
  ) { }

  public beast: any = {}
  public isAllSignsTableShown = false;
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public averageVitality = null
  public checkboxes = []
  public locationCheckboxes: any = {}
  public trauma = 0;
  public monsterNumber = null;
  public lairLoot = []
  public lairlootpresent = false
  public carriedLoot = []
  public carriedlootpresent = false
  public selectedRoleId = null;
  public primaryTables = primaryTables;
  public secondaryTables = secondaryTables;
  public demonIds = demonIds
  public demonTables = demonTables
  public selectedRole: any = {}
  public combatRolesInfo = roles.combatRoles.primary
  public combatSecondaryInfo = roles.combatRoles.secondary
  public socialRolesInfo = roles.socialRoles.primary
  public socialSecondaryInfo = roles.socialRoles.secondary
  public skillRolesInfo = roles.skillRoles
  public displayedFatigue = null;
  public numberFatigue = null;
  public displayedPanic = null;
  public numberPanic = null;
  public displayVitalityAverage = null;
  public displayVitalityDice = null;
  public displayedVitalityRoll = null;
  public isFodderSecondary = false;
  public isDefaultVitality = false;

  public selectedObstacleId = null;

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }

  public newSelectedWeapon;
  public newWeaponInfo;
  public newSelectedArmor;
  public newArmorInfo
  public newSelectedShield;
  public newShieldInfo;
  public showAllEquipment;

  public showSkillSection = true;
  public showCharacteristicsSection = true
  public showDescriptions = false
  public showConvictions = false
  public showDevotions = false
  public showFlaws = false

  public groupId = null

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']

      this.handleAnyFlaws()
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      // this.metaService.updateTag({ name: 'og:description', content: this.beast.name });
      // this.metaService.updateTag( { name:'og:image', content: "https://bestiary.dragon-slayer.net/assets/preview.png" });
      this.getRandomEncounter()

      this.getLoot()

      this.beastService.getEquipment().subscribe(res => {
        this.equipmentLists = res.lists
        this.equipmentObjects = res.objects
      })

      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      }

      this.determineIfSkillsShouldBeShown()
      this.determineIfCharacteristicsShouldBeShown()
      this.convertPanic()
      this.setDisplayVitality()
      this.setLocationalVitality()

      let roleParameter = this.router.url.split('/')[4]
      if (roleParameter) {
        this.setRoleViaParameter(roleParameter)
      } else {
        this.setRoleToDefault()
      }
    })
  }

  determineIfSkillsShouldBeShown = () => {
    if (!this.selectedRoleId) {
      this.showSkillSection = this.beast.skills.length > 0
    } else {
      let showSkillSectionTemp = false

      for (let i = 0; i < this.beast.skills.length; i++) {
        if (this.beast.skills[i].skillroleid === this.selectedRoleId || this.beast.skills[i].allroles) {
          showSkillSectionTemp = true
          i = this.beast.skills.length
        }
      }
      this.showSkillSection = showSkillSectionTemp
    }
  }

  determineIfCharacteristicsShouldBeShown = () => {
    if (!this.selectedRoleId) {
      this.showDescriptions = this.beast.conflict.descriptions.length > 0
      this.showConvictions = this.beast.conflict.convictions.length > 0 
      this.showDevotions = this.beast.conflict.devotions.length > 0
      this.showFlaws = this.beast.conflict.flaws.length > 0
    } else {
      this.showDescriptions = false
      this.showConvictions = false
      this.showDevotions = false
      this.showFlaws = false
      
      for (let i = 0; i < this.beast.conflict.descriptions.length; i++) {
        if (this.beast.conflict.descriptions[i].socialroleid === this.selectedRoleId || this.beast.conflict.descriptions[i].allroles) {
          this.showDescriptions = true
          i = this.beast.conflict.descriptions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.convictions.length; i++) {
        if (this.beast.conflict.convictions[i].socialroleid === this.selectedRoleId || this.beast.conflict.convictions[i].allroles) {
          this.showConvictions = true
          i = this.beast.conflict.convictions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.devotions.length; i++) {
        if (this.beast.conflict.devotions[i].socialroleid === this.selectedRoleId || this.beast.conflict.devotions[i].allroles) {
          this.showDevotions = true
          i = this.beast.conflict.devotions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.flaws.length; i++) {
        if (this.beast.conflict.flaws[i].socialroleid === this.selectedRoleId || this.beast.conflict.flaws[i].allroles) {
          this.showFlaws = true
          i = this.beast.conflict.flaws.length
        }
      }

    }
    this.showCharacteristicsSection = this.showDescriptions || this.showConvictions || this.showDevotions || this.showFlaws
  }

  handleAnyFlaws = () => {
    let anyCount = 0
    this.beast.conflict.flaws.forEach(flaw => flaw.trait === 'Any' ? anyCount++ : null)

    if (anyCount) {
      this.beastService.getAnyFlaws(anyCount).subscribe((result: any[]) => {
        this.beast.conflict.flaws.map(flaw => {
          if (flaw.trait === 'Any') {
            let rolledFlaw = result.shift().flaw
            const severityAndRank = this.getFlawSeverityAndRank(rolledFlaw, flaw.value)
            flaw.trait = `${rolledFlaw.flaw} (${severityAndRank.severity})`
            flaw.value = severityAndRank.rank
          }
          return flaw
        })
        this.beast.conflict.flaws = this.beast.conflict.flaws.sort((a, b) => +b.value - +a.value)
      })
    }
  }

  getFlawSeverityAndRank = (flaw, modifier) => {
    if (flaw.cap === 'n/a') {
      flaw.cap = 20
    }
    let severity = +Math.floor(Math.random() * Math.floor(flaw.cap)) + 1

    if (modifier === '2') {
      severity = Math.floor(severity / 3)
    } else if (modifier === '3') {
      if (severity > (flaw.cap / 2)) {
        severity = severity - Math.ceil(severity / 3)
      } else if (severity < (flaw.cap / 2)) {
        severity = severity + Math.ceil(severity / 3)
      }
    } else if (modifier === '4') {
      severity *= 2
      if (severity > flaw.cap) {
        severity = flaw.cap
      }
    }

    const rank = Math.ceil(flaw.rank.base + (flaw.rank.per * severity))

    return { severity, rank }
  }

  setLocationalVitality = () => {
    if (this.beast.locationalvitality.length > 0) {
      this.beast.locationalvitality = this.beast.locationalvitality.map(location => {
        location.average = this.calculatorService.calculateAverageOfDice(location.vitality)
        location.rolled = this.calculatorService.rollDice(location.vitality)
        return location
      })
    }
  }

  setDisplayVitality = () => {
    let vitality = null
    let role = null
    let secondaryrole = null

    if (this.selectedRoleId) {
      vitality = this.beast.roleInfo[this.selectedRoleId].vitality
      role = this.beast.roleInfo[this.selectedRoleId].role
      secondaryrole = this.beast.roleInfo[this.selectedRoleId].secondaryrole
    } else {
      vitality = this.beast.vitality
      role = this.beast.role
      secondaryrole = this.beast.secondaryrole
    }

    if (role && !vitality) {
      this.isDefaultVitality = true
      vitality = this.combatRolesInfo[role].vitality
    } else if (this.selectedRoleId && !role && !vitality && this.beast.vitality) {
      this.isDefaultVitality = false
      vitality = this.beast.vitality
    } else if (!role && !vitality) {
      this.isDefaultVitality = false
      vitality = 0
    }

    this.displayVitalityAverage = this.calculatorService.calculateAverageOfDice(vitality)
    if (secondaryrole === 'Fodder') {
      this.isFodderSecondary = true
      this.displayVitalityAverage = Math.ceil(this.displayVitalityAverage / 2)
    } else {
      this.isFodderSecondary = false
    }
    this.displayVitalityDice = vitality
    this.displayedVitalityRoll = this.calculatorService.rollDice(vitality)
    if (secondaryrole === 'Fodder') {
      this.displayedVitalityRoll = Math.ceil(this.displayedVitalityRoll / 2)
    }
    this.trauma = +(this.displayVitalityAverage / 2).toFixed(0)

    this.displayedFatigue = this.displayService.getLetterFatigue(this.beast, this.selectedRoleId, roles)
    this.getNumberFatigue(this.displayedFatigue);
  }

  setMonsterNumber = (event) => {
    if (+event.target.value < 1) {
      event.target.value = 1
    } else if (+event.target.value > 25) {
      event.target.value = 25
    }
    this.monsterNumber = +event.target.value
  }

  getLoot() {
    this.getLairLoot()
    this.getCarriedLoot()
  }

  getLairLoot() {
    this.lairLoot = []
    let timesToRoll = this.monsterNumber ? this.monsterNumber : 1;
    let { copper, silver, gold, relic, enchanted, potion, equipment, traited, scrolls, alms } = this.beast.lairloot

    this.lairlootpresent = copper || silver || gold || relic || enchanted || potion || equipment.length > 0 || traited > 0 || scrolls > 0 || alms > 0
    let { staticValues, numberAppearing, relicTable, traitedChance, traitDice, enchantedTable, scrollPower, almsFavor } = lootTables
      , { rollDice } = this.calculatorService

    if (relic) {
      for (let i = 0; i < timesToRoll; i++) {
        let relicChance = Math.floor(Math.random() * 101);
        if (relicTable[relic].middling >= relicChance) {
          this.lairLoot.push("Middling Relic")
        } else if (relicTable[relic].minor >= relicChance) {
          this.lairLoot.push("Minor Relic")
        }
      }
    }

    if (alms.length > 0) {
      for (let i = 0; i < timesToRoll; i++) {
        for (let x = 0; x < alms.length; x++) {
          let favor = rollDice(almsFavor[alms[x].favor])
            , number = rollDice(numberAppearing[alms[x].number])
          if (number > 0) {
            this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
          }
        }
      }
    }

    if (enchanted) {
      for (let i = 0; i < timesToRoll; i++) {
        let enchantedChance = Math.floor(Math.random() * 101);
        if (enchantedTable[enchanted].middling >= enchantedChance) {
          this.lairLoot.push("Middling Enchanted Item")
        } else if (enchantedTable[enchanted].minor >= enchantedChance) {
          this.lairLoot.push("Minor Enchanted Item")
        }
      }
    }

    if (potion) {
      let potionNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        potionNumber += rollDice(numberAppearing[potion])
      }
      if (potionNumber > 0) {
        this.lairLoot.push(`${potionNumber} potion${potionNumber > 1 ? 's' : ''}`)
      }
    }

    if (scrolls.length > 0) {
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < scrolls.length; i++) {
          let power = rollDice(scrollPower[scrolls[i].power])
            , number = rollDice(numberAppearing[scrolls[i].number])
          if (number > 0) {
            this.lairLoot.push(`${number} scroll${number > 1 ? 's' : ''} (${power} SP)`)
          }
        }
      }
    }

    if (traited.length > 0) {
      let equipmentToGetArray = []
      let descriptions = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < traited.length; i++) {
          let traitChance = Math.floor(Math.random() * 101)
            , table = traitedChance[traited[i].chancetable]
            , valueOfItem = staticValues[traited[i].value]
          for (let x = 0; x < table.length; x++) {
            if (traitChance <= table[x]) {
              let value = rollDice(valueOfItem)
              if (value > 0) {
                descriptions.push(traitDice[x])
                equipmentToGetArray.push(value)
              }
              x = table.length
            }
          }
        }
      }
      if (equipmentToGetArray.length > 0) {
        this.beastService.getUniqueEquipment({ "budgets": equipmentToGetArray }).subscribe(result => {
          for (let i = 0; i < result.length; i++) {
            this.lairLoot.push(result[i] + ` It also has a total of ${descriptions[i]} in Descriptions`)
          }
        })
      }
    }

    if (equipment.length > 0) {
      let equipmentToGetArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < equipment.length; i++) {
          let number = rollDice(numberAppearing[equipment[i].number])
          for (let x = 0; x < number; x++) {
            let value = rollDice(staticValues[equipment[i].value])
            if (value > 0) {
              equipmentToGetArray.push(value)
            }
          }
        }
      }
      if (equipmentToGetArray.length > 0) {
        this.beastService.getUniqueEquipment({ "budgets": equipmentToGetArray }).subscribe(result => {
          this.lairLoot = [...this.lairLoot, ...result]
        })
      }
    }

    if (copper) {
      let copperNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        copperNumber += rollDice(staticValues[copper]);
      }
      if (copperNumber > 0) {
        this.lairLoot.push(copperNumber + " cc in coin")
      }
    }
    if (silver) {
      let silverNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        silverNumber += rollDice(staticValues[silver]);
      }
      if (silverNumber > 0) {
        this.lairLoot.push(silverNumber + " sc in coin")
      }
    }
    if (gold) {
      let goldNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        goldNumber += rollDice(staticValues[gold]);
      }
      if (goldNumber > 0) {
        this.lairLoot.push(goldNumber + " gc in coin")
      }
    }
  }

  getCarriedLoot() {
    this.carriedLoot = []
    let timesToRoll = this.monsterNumber ? this.monsterNumber : 1;
    let { copper, silver, gold, relic, enchanted, potion, equipment, traited, scrolls, alms } = this.beast.carriedloot

    this.carriedlootpresent = copper || silver || gold || relic || enchanted || potion || equipment.length > 0 || traited > 0 || scrolls > 0 || alms > 0
    let { staticValues, numberAppearing, relicTable, traitedChance, traitDice, enchantedTable, scrollPower, almsFavor } = lootTables
      , { rollDice } = this.calculatorService

    if (relic) {
      for (let i = 0; i < timesToRoll; i++) {
        let relicChance = Math.floor(Math.random() * 101);
        if (relicTable[relic].middling >= relicChance) {
          this.carriedLoot.push("Middling Relic")
        } else if (relicTable[relic].minor >= relicChance) {
          this.carriedLoot.push("Minor Relic")
        }
      }
    }

    if (alms.length > 0) {
      for (let i = 0; i < timesToRoll; i++) {
        for (let x = 0; x < alms.length; x++) {
          let favor = rollDice(almsFavor[alms[x].favor])
            , number = rollDice(numberAppearing[alms[x].number])
          if (number > 0) {
            this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
          }
        }
      }
    }

    if (enchanted) {
      for (let i = 0; i < timesToRoll; i++) {
        let enchantedChance = Math.floor(Math.random() * 101);
        if (enchantedTable[enchanted].middling >= enchantedChance) {
          this.carriedLoot.push("Middling Enchanted Item")
        } else if (enchantedTable[enchanted].minor >= enchantedChance) {
          this.carriedLoot.push("Minor Enchanted Item")
        }
      }
    }

    if (potion) {
      let potionNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        potionNumber += rollDice(numberAppearing[potion])
      }
      if (potionNumber > 0) {
        this.carriedLoot.push(`${potionNumber} potion${potionNumber > 1 ? 's' : ''}`)
      }
    }

    if (scrolls.length > 0) {
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < scrolls.length; i++) {
          let power = rollDice(scrollPower[scrolls[i].power])
            , number = rollDice(numberAppearing[scrolls[i].number])
          if (number > 0) {
            this.carriedLoot.push(`${number} scroll${number > 1 ? 's' : ''} (${power} SP)`)
          }
        }
      }
    }

    if (traited.length > 0) {
      let equipmentToGetArray = []
      let descriptions = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < traited.length; i++) {
          let traitChance = Math.floor(Math.random() * 101)
            , table = traitedChance[traited[i].chancetable]
            , valueOfItem = staticValues[traited[i].value]
          for (let x = 0; x < table.length; x++) {
            if (traitChance <= table[x]) {
              let value = rollDice(valueOfItem)
              if (value > 0) {
                descriptions.push(traitDice[x])
                equipmentToGetArray.push(value)
              }
              x = table.length
            }
          }
        }
      }
      if (equipmentToGetArray.length > 0) {
        this.beastService.getUniqueEquipment({ "budgets": equipmentToGetArray }).subscribe(result => {
          for (let i = 0; i < result.length; i++) {
            this.carriedLoot.push(result[i] + ` It also has a total of ${descriptions[i]} in Descriptions`)
          }
        })
      }
    }

    if (equipment.length > 0) {
      let equipmentToGetArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < equipment.length; i++) {
          let number = rollDice(numberAppearing[equipment[i].number])
          for (let x = 0; x < number; x++) {
            let value = rollDice(staticValues[equipment[i].value])
            if (value > 0) {
              equipmentToGetArray.push(value)
            }
          }
        }
      }
      if (equipmentToGetArray.length > 0) {
        this.beastService.getUniqueEquipment({ "budgets": equipmentToGetArray }).subscribe(result => {
          this.carriedLoot = [...this.carriedLoot, ...result]
        })
      }
    }

    if (copper) {
      let copperNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        copperNumber += rollDice(staticValues[copper]);
      }
      if (copperNumber > 0) {
        this.carriedLoot.push(copperNumber + " cc in coin")
      }
    }
    if (silver) {
      let silverNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        silverNumber += rollDice(staticValues[silver]);
      }
      if (silverNumber > 0) {
        this.carriedLoot.push(silverNumber + " sc in coin")
      }
    }
    if (gold) {
      let goldNumber = 0
      for (let i = 0; i < timesToRoll; i++) {
        goldNumber += rollDice(staticValues[gold]);
      }
      if (goldNumber > 0) {
        this.carriedLoot.push(goldNumber + " gc in coin")
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
    this.beastService.getRandomEncounter(this.beast.id, this.groupId).subscribe((result: any) => {
      if (result.main) {
        let distance = 0
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

        result.main.milesFromLair = distance > 0 ? distance : result.main.milesFromLair
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
        price = 5
      } else {
        price = difficulty;
      }
    } else if (isNaN(harvestAndDifficulty) && harvest !== 'n/a') {
      price = justDifficulty * 5
    } else if (isNaN(harvestAndDifficulty) && harvest === 'n/a') {
      price = this.calculatorService.calculateAverageOfDice(difficulty) * 5
    } else {
      price = harvestAndDifficulty * 5
    }

    if (isNaN(price)) {
      return 'Priceless'
    }

    const rarityMultipliers = {
      1: 5,
      2: 2,
      3: 1,
      5: .5,
      10: .25
    }

    return (price * rarityMultipliers[this.beast.rarity]).toFixed(1) + 'sc'
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

  setRoleToDefault() {
    if (!this.beast.defaultrole && this.beast.roles.length > 0) {
      this.beast.defaultrole = this.beast.roles[0].id
    }

    if (this.beast.defaultrole) {
      this.setRole({ value: this.beast.defaultrole })
    }
  }

  setRoleViaParameter(param) {
    let uppercaseParam = param.toUpperCase()
    for (let i = 0; i < this.beast.roles.length; i++) {
      let role = this.beast.roles[i]
      if (role.name.replace(/\s|-/g, '').toUpperCase() === uppercaseParam || param === role.id) {
        this.setRole({ value: role.id })
      }
    }
  }

  setGroupParam (event) {
    this.groupId = event.value
    this.getRandomEncounter()
  }

  setRole(event) {
    if (event.value) {
      this.selectedRoleId = event.value
      if (this.beast.roleInfo[this.selectedRoleId].role) {
        this.selectedRole = this.combatRolesInfo[this.beast.roleInfo[this.selectedRoleId].role]
      } else {
        this.selectedRole = {}
      }
    } else {
      this.selectedRoleId = null
      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      } else {
        this.selectedRole = {}
      }
    }

    this.determineIfSkillsShouldBeShown()
    this.determineIfCharacteristicsShouldBeShown()

    this.displayedFatigue = this.displayService.getLetterFatigue(this.beast, this.selectedRoleId, roles)
    this.getNumberFatigue(this.displayedFatigue);
    this.setDisplayVitality()
    this.convertPanic()
  }

  addToQuickView() {
    let hash = this.beast.hash
    if (this.selectedRoleId) {
      hash = this.beast.roleInfo[this.selectedRoleId].hash
    }
    this.quickViewService.addToQuickViewArray(hash)
  }

  convertPanic() {
    let stress
    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].stress) {
      stress = this.beast.roleInfo[this.selectedRoleId].stress
    } else if ((this.selectedRoleId && !this.beast.roleInfo[this.selectedRoleId].stress) || !this.selectedRoleId) {
      stress = this.beast.stress
    }
    let panic
    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].panic) {
      panic = this.beast.roleInfo[this.selectedRoleId].panic
    } else if ((this.selectedRoleId && !this.beast.roleInfo[this.selectedRoleId].panic) || !this.selectedRoleId) {
      panic = this.beast.panic
    }

    switch (panic) {
      case 1:
        this.displayedPanic = 'Always';
        break;
      case 2:
        this.displayedPanic = 'Unsure';
        break;
      case 3:
        this.displayedPanic = 'Nervous';
        break;
      case 4:
        this.displayedPanic = 'Shaken';
        break;
      case 5:
        this.displayedPanic = 'Breaking'
        break;
      case 7:
        this.displayedPanic = 'Never'
      default: panic
    }

    this.numberPanic = this.displayService.convertPanic(stress, panic)
  }

  getNumberFatigue(displayedFatigue) {
    if (isNaN(this.displayedVitalityRoll)) {
      this.numberFatigue = 'N'
    }
    switch (displayedFatigue) {
      case 'Always':
        this.numberFatigue = 'A'
        break;
      case 'H':
        this.numberFatigue = 1
        break
      case 'B':
        this.numberFatigue = (this.displayedVitalityRoll * .25).toFixed(0)
        break;
      case 'W':
        this.numberFatigue = (this.displayedVitalityRoll * .5).toFixed(0)
        break;
      case 'C':
        this.numberFatigue = (this.displayedVitalityRoll * .75).toFixed(0)
        break;
      case 'Never':
      case 'N':
        this.numberFatigue = 'N'
        break;
      default:
        this.numberFatigue = (this.displayedVitalityRoll * .75).toFixed(0)
    }
  }

  toggleEquipmentSelection = (square) => {
    if (!square.showEquipmentSelection) {
      this.newSelectedWeapon = square.selectedweapon
      this.newWeaponInfo = square.weaponInfo
      this.newWeaponInfo.weapontype = square.weapontype
      this.newSelectedArmor = square.selectedarmor
      this.newArmorInfo = square.armorInfo
      this.newSelectedShield = square.selectedshield
      this.newShieldInfo = square.shieldInfo
      this.showAllEquipment = this.displayService.turnOnAllEquipment(this.beast.roleInfo, this.newSelectedWeapon, this.newSelectedArmor, this.newSelectedShield)
    } else if (square.showEquipmentSelection) {
      square.selectedweapon = this.newSelectedWeapon

      if (this.selectedRoleId && !this.beast.specialAbilities[this.selectedRoleId]) {
        this.beast.specialAbilities[this.selectedRoleId] = []
      } else if (!this.selectedRoleId && !this.beast.specialAbilities.generic) {
        this.beast.specialAbilities.generic = []
      }

      if (this.selectedRoleId) {
        if (square.weaponInfo.bonusLong) {
          this.beast.specialAbilities[this.selectedRoleId] = this.beast.specialAbilities[this.selectedRoleId].filter(bonus => bonus !== square.weaponInfo.bonusLong)
        }
        if (this.newWeaponInfo && this.newWeaponInfo.bonusLong) {
          this.beast.specialAbilities[this.selectedRoleId].push(this.newWeaponInfo.bonusLong)
        }
        if (square.shieldInfo && square.shieldInfo.bonusLong) {
          this.beast.specialAbilities[this.selectedRoleId] = this.beast.specialAbilities[this.selectedRoleId].filter(bonus => bonus !== square.shieldInfo.bonusLong)
        }
        if (this.newShieldInfo && this.newShieldInfo.bonusLong) {
          this.beast.specialAbilities[this.selectedRoleId].push(this.newShieldInfo.bonusLong)
        }
      } else if (!this.selectedRoleId) {
        if (square.weaponInfo.bonusLong) {
          this.beast.specialAbilities.generic = this.beast.specialAbilities.generic.filter(bonus => bonus !== square.weaponInfo.bonusLong)
        }
        if (this.newWeaponInfo && this.newWeaponInfo.bonusLong) {
          this.beast.specialAbilities.generic.push(this.newWeaponInfo.bonusLong)
        }
        if (square.shieldInfo && square.shieldInfo.bonusLong) {
          this.beast.specialAbilities.generic = this.beast.specialAbilities.generic.filter(bonus => bonus !== square.shieldInfo.bonusLong)
        }
        if (this.newShieldInfo && this.newShieldInfo.bonusLong) {
          this.beast.specialAbilities.generic.push(this.newShieldInfo.bonusLong)
        }
      }

      square.weaponInfo = this.newWeaponInfo
      if (square.weaponInfo.range) {
        square.weapontype = 'r'
        if (!square.ranges) {
          square.ranges = { increment: 0 }
        }
      } else {
        square.weapontype = 'm'
      }
      square.selectedarmor = this.newSelectedArmor
      square.armorInfo = this.newArmorInfo
      square.selectedshield = this.newSelectedShield
      square.shieldInfo = this.newShieldInfo
    }
    square.showEquipmentSelection = !square.showEquipmentSelection
  }

  backoutOfEquipmentSelection = (square) => {
    this.newSelectedWeapon = null
    this.newWeaponInfo = null
    this.newSelectedArmor = null
    this.newArmorInfo = null
    this.newSelectedShield = null
    this.newShieldInfo = null
    this.showAllEquipment = false
    square.showEquipmentSelection = false
  }

  captureEquipmentChange = ({ value }, type) => {
    if (value === 'None') { value = null }
    if (type === 'selectedweapon') {
      this.newSelectedWeapon = value
      this.newWeaponInfo = this.equipmentObjects.weapons[value]
      if (this.newWeaponInfo && this.newWeaponInfo.range) {
        this.newWeaponInfo.weapontype = 'r'
      } else if (this.newWeaponInfo) {
        this.newWeaponInfo.weapontype = 'm'
      } else {
        this.newWeaponInfo = { weapontype: 'm' }
      }
    } else if (type === 'selectedarmor') {
      this.newSelectedArmor = value
      this.newArmorInfo = this.equipmentObjects.armor[value]
    } else if (type === 'selectedshield') {
      this.newSelectedShield = value
      this.newShieldInfo = this.equipmentObjects.shields[value]
    }
  }

  checkShowAllEquipment = (checked) => {
    this.showAllEquipment = checked
  }

  toggleAllSigns = () => {
    this.isAllSignsTableShown = !this.isAllSignsTableShown
  }

  spellPointBonus = () => {
    switch (+this.beast.rarity) {
      case 1:
        return '+32';
      case 3:
        return '+16';
      case 5:
        return '+8';
      case 10:
        return '+4';
      default:
        return '+0'
    }
  }

  spellCheckBonus = () => {
    switch (+this.beast.rarity) {
      case 1:
        return '+16';
      case 3:
        return '+8';
      case 5:
        return '+4';
      case 10:
        return '+2';
      default:
        return '+0'
    }
  }

  handleCommaInName(name) {
    if (name.includes(',')) {
      let splitname = name.split(', ')
      return `${splitname[1]} ${splitname[0]}`
    } else {
      return name
    }
  }

  tooltipName(combatrole, secondarycombat, socialrole, socialsecondary, skillrole) {
    let nameString = ''
    let roles = false

    let name = ''

    if (combatrole || socialrole || skillrole) {
      nameString += ' ['
      roles = true
    }
    if (combatrole) {
      nameString += `${combatrole}`
      if (secondarycombat) {
        nameString += ` (${secondarycombat})`
      }
    }
    if (socialrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `${socialrole}`
      if (socialsecondary) {
        nameString += ` (${socialsecondary})`
      }
    }
    if (skillrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `${skillrole}`
    }

    if (roles) {
      nameString += ']'
    }

    return nameString
  }

  getShortCutURL() {
    let textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    let urlArray = this.router.url.split('/')
    let url = `${window.location.origin}/beast/${urlArray[2]}/gm/${this.selectedRoleId}`
    textArea.value = url;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      this.beastService.handleMessage({ color: 'green', message: `${url} successfully copied` })
    } catch (err) {
      this.beastService.handleMessage({ color: 'red', message: `Unable to copy ${url}` })
    }

    document.body.removeChild(textArea);
  }

  includesSwarm() {
    let includesSwarm = false
    this.beast.types.forEach(val => {
      if (val.typeid === 10) {
        includesSwarm = true
      }
    })
    return includesSwarm
  }

  selectObstacle(obstacleId) {
    if (obstacleId === this.selectedObstacleId) {
      this.selectedObstacleId = null
    } else {
      this.selectedObstacleId = obstacleId
    }
  }

  goToEditBinded = this.goToEdit.bind(this)

  goToEdit() {
    this.router.navigate([`/obstacle/edit/${this.selectedObstacleId}`])
  }

  openChallenge(id) {
    this.dialog.open(ChallengePopUpComponent, { panelClass: 'my-class', data: { id } })
  }

  getConnector(object, index) {
    const length = Object.keys(object).length

    if (index === 0) {
      return ' '
    } else if (index < length - 1) {
      return ', '
    } else {
      return ', and '
    }
  }

  aOrAn(label) {
    var vowels = ("aeioAEIO");
    if (vowels.indexOf(label[0]) !== -1) {
      return 'An'
    }
    return 'A'
  }

  createEncounterLabel(label, roles) {
    const roleLength = Object.keys(roles).length
    if (roleLength > 1) {
      return `${this.aOrAn(label)} ${label} of`
    } else {
      let number = 0
      for (let key in roles) {
        number = roles[key]
      }
      if (number > 1) {
        return `${this.aOrAn(label)} ${label} of`
      } else {
        return ``
      }
    }
  }

  goToVariant(variantid) {
    this.beast = {}
    this.isAllSignsTableShown = false;
    this.encounter = "loading";
    this.loggedIn = this.beastService.loggedIn || false;
    this.imageBase = variables.imageBase;
    this.averageVitality = null
    this.checkboxes = []
    this.locationCheckboxes = {}
    this.trauma = 0;
    this.monsterNumber = null;
    this.lairLoot = []
    this.lairlootpresent = false
    this.carriedLoot = []
    this.carriedlootpresent = false
    this.selectedRoleId = null;
    this.primaryTables = primaryTables;
    this.secondaryTables = secondaryTables;
    this.demonIds = demonIds
    this.demonTables = demonTables
    this.selectedRole = {}
    this.combatRolesInfo = roles.combatRoles.primary
    this.combatSecondaryInfo = roles.combatRoles.secondary
    this.socialRolesInfo = roles.socialRoles.primary
    this.socialSecondaryInfo = roles.socialRoles.secondary
    this.skillRolesInfo = roles.skillRoles
    this.displayedFatigue = null;
    this.numberFatigue = null;
    this.displayedPanic = null;
    this.numberPanic = null;
    this.displayVitalityAverage = null;
    this.displayVitalityDice = null;
    this.displayedVitalityRoll = null;
    this.isFodderSecondary = false;
    this.isDefaultVitality = false;

    this.equipmentLists = { weapons: [], armor: [], shields: [] }
    this.equipmentObjects = { weapons: {}, armor: {}, shields: {} }
    // [routerLink]="['/beast', variant.variantid, 'gm']"
    this.router.navigate(['/beast', variantid, 'gm'])
  }
}
