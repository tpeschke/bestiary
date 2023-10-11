import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { Title, Meta } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"
import { QuickViewService } from 'src/app/util/services/quick-view.service';
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
  public checkboxes = []
  public locationCheckboxes: any = {}
  public trauma = 0;
  public monsterNumber = null;
  public lairLoot = []
  public lairlootpresent = false
  public carriedLoot = []
  public carriedlootpresent = false
  public selectedRoleId = null;
  public selectedRole: any = {}
  public combatRolesInfo = roles.combatRoles.primary
  public combatSecondaryInfo = roles.combatRoles.secondary
  public socialRolesInfo = roles.socialRoles.primary
  public socialSecondaryInfo = roles.socialRoles.secondary
  public skillRolesInfo = roles.skillRoles
  public displayedVitalityRoll = null

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
  public aLotOfMovement = false
  public showDescriptions = false
  public showConvictions = false
  public showDevotions = false
  public showFlaws = false

  public groupId = null

  public tokenExists: Boolean = false

  public battlefieldPatternDictionary = {
    'Open Field': 'openfield',
    'Divide': 'divide',
    'Danger Wall': 'dangerwall',
    'Pillar': 'pillar',
    'Guardian': 'guardian',
    'Pincer': 'pincer',
    'Funnel': 'funnel',
    'Horseshoe': 'horseshoe',
    'Long-Path': 'longpath',
    'Alley': 'alley',
    'Up-Hill': 'uphill',
    'King of the Hill': 'kingofthehill'
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']

      this.beastService.checkToken(this.beast.id).subscribe((res: Boolean) => {
        this.tokenExists = res
      })

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

  forceDownload() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + this.beast.id + '-token', true);
    xhr.responseType = "blob";
    const beastName = this.beast.name
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = beastName + '.png';
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
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

  determineIfAlotOfMovement = () => {
    if (!this.selectedRoleId) {
      this.aLotOfMovement = this.beast.movement.length > 3
    } else {
      let movementCount = 0
      this.aLotOfMovement = false
      for (let i = 0; i < this.beast.movement.length; i++) {
        if (this.beast.movement[i].roleid === this.selectedRoleId || this.beast.movement[i].allroles) {
          movementCount++
          if (movementCount > 3) {
            this.aLotOfMovement = true
            i = this.beast.movement.length
          }
        }
      }
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
            const severity = this.getFlawSeverity(rolledFlaw, flaw.value)
            flaw.trait = `${rolledFlaw.flaw}`
            flaw.severity ? null : flaw.severity = severity
          }
          return flaw
        })
        this.beast.conflict.flaws = this.beast.conflict.flaws.sort((a, b) => +b.value - +a.value)
      })
    }
  }

  getFlawSeverity = (flaw, modifier) => {
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

    return severity
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

  findWhatToDisplay = (object, key, toReturn = 'N/A') => {
    const thisToDisplay = this.selectedRoleId ? this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress[object][key] : this.beast.phyiscalAndStress[object][key]
    if (thisToDisplay === 'N') {
      return toReturn
    }
    return thisToDisplay
  }

  setDisplayVitality = () => {
    if (this.selectedRoleId) {
      let diceToRoll = this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress.physical.diceString
      if (diceToRoll.includes('(KB')) {
        diceToRoll = diceToRoll.split('(')[0]
      }
      this.displayedVitalityRoll = this.calculatorService.rollDice(diceToRoll)
      this.trauma = +(this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress.physical.largeweapons / 2).toFixed(0)
    } else {
      let diceToRoll = this.beast.phyiscalAndStress.physical.diceString
      if (diceToRoll.includes('(KB')) {
        diceToRoll = diceToRoll.split('(')[0]
      }
      this.displayedVitalityRoll = this.calculatorService.rollDice(diceToRoll)
      this.trauma = +(this.beast.phyiscalAndStress.physical.largeweapons / 2).toFixed(0)
    }
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
    if (!difficulty || difficulty.toUpperCase() === 'N/A') {
      difficulty = '0'
    }
    if (harvest && harvest.toUpperCase() === 'N/A') {
      harvest = '0'
    } else if (!harvest) {
      harvest = difficulty
    }

    let harvestAndDifficulty = this.calculatorService.calculateAverageOfDice(harvest + "+" + difficulty + '+' + this.getRarityModifier(this.beast.rarity))
      , justDifficulty = this.calculatorService.calculateAverageOfDice(difficulty + "+" + difficulty + '+' + this.getRarityModifier(this.beast.rarity))
      , price;
    if (isNaN(harvestAndDifficulty) && !difficulty.includes("!") || !difficulty.includes("d")) {
      if (difficulty === '0') {
        price = 5
      } else {
        price = difficulty;
      }
    } else if (isNaN(harvestAndDifficulty) && harvest !== 'n/a') {
      price = justDifficulty * 2
    } else if (isNaN(harvestAndDifficulty) && harvest === 'n/a') {
      price = this.calculatorService.calculateAverageOfDice(difficulty)  * 2
    } else {
      price = harvestAndDifficulty * 2
    }

    if (harvest === '0' && difficulty === '0') {
      return 'Priceless'
    }

    return price + ' sc'
  }

  getUrl(id) {
    return `https://bestiary.dragon-slayer.net/beast/${id}/gm`
  }

  getRarityModifier(rarity) {
    switch (+rarity) {
      case 1:
        return '2d20!';
      case 3:
        return 'd20!';
      case 5:
        return 'd10!';
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

  setGroupParam(event) {
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
    this.determineIfAlotOfMovement()

    this.setDisplayVitality()
  }

  addToQuickView() {
    let hash = this.beast.hash
    if (this.selectedRoleId) {
      hash = this.beast.roleInfo[this.selectedRoleId].hash
    }
    this.quickViewService.addToQuickViewArray(hash)
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
      // this.showAllEquipment = this.displayService.turnOnAllEquipment(this.beast.roleInfo, this.newSelectedWeapon, this.newSelectedArmor, this.newSelectedShield)
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
    this.checkboxes = []
    this.locationCheckboxes = {}
    this.trauma = 0;
    this.monsterNumber = null;
    this.lairLoot = []
    this.lairlootpresent = false
    this.carriedLoot = []
    this.carriedlootpresent = false
    this.selectedRoleId = null;
    this.selectedRole = {}
    this.combatRolesInfo = roles.combatRoles.primary
    this.combatSecondaryInfo = roles.combatRoles.secondary
    this.socialRolesInfo = roles.socialRoles.primary
    this.socialSecondaryInfo = roles.socialRoles.secondary
    this.skillRolesInfo = roles.skillRoles
    this.displayedVitalityRoll = null;

    this.equipmentLists = { weapons: [], armor: [], shields: [] }
    this.equipmentObjects = { weapons: {}, armor: {}, shields: {} }
    // [routerLink]="['/beast', variant.variantid, 'gm']"
    this.router.navigate(['/beast', variantid, 'gm'])
  }
}
