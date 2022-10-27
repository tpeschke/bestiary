import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { MatDialog } from '@angular/material';
import { Title, Meta } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"
import { QuickViewService } from 'src/app/util/services/quick-view.service';
import { primaryTables, secondaryTables } from './firbolg-tables'
import { demonIds, tables as demonTables } from './demon-tables'
import roles from '../roles.js'

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
    private dialog: MatDialog,
    public router: Router,
    public titleService: Title,
    public quickViewService: QuickViewService,
    public metaService: Meta
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
  public selectedRoleId = null;
  public primaryTables = primaryTables;
  public secondaryTables = secondaryTables;
  public demonIds = demonIds
  public demonTables = demonTables
  public selectedRole: any = {}
  public combatRolesInfo = roles.combatRoles.primary
  public socialRolesInfo = roles.socialRoles
  public skillRolesInfo = roles.skillRoles
  public displayedFatigue = null;
  public numberFatigue = null;
  public displayedPanic = null;
  public numberPanic = null;

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }

  public newSelectedWeapon;
  public newWeaponInfo;
  public newSelectedArmor;
  public newArmorInfo
  public newSelectedShield;
  public newShieldInfo;
  public showAllEquipment;

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      this.metaService.updateTag({ name: 'og:description', content: this.beast.name });
      // this.metaService.updateTag( { name:'og:image', content: "https://bestiary.dragon-slayer.net/assets/preview.png" });
      this.getRandomEncounter()

      this.locationCheckboxes.mainVitality = {
        id: "mainVitality",
        average: this.calculatorService.calculateAverageOfDice(this.beast.vitality),
        rolled: this.calculatorService.rollDice(this.beast.vitality)
      }
      this.locationCheckboxes.mainVitality.checkboxes = this.createCheckboxArray(this.locationCheckboxes.mainVitality.average)

      for (const role in this.beast.roleInfo) {
        if (this.beast.roleInfo[role].vitality) {
          this.beast.roleInfo[role].average = this.calculatorService.calculateAverageOfDice(this.beast.roleInfo[role].vitality)
          this.beast.roleInfo[role].rolled = this.calculatorService.rollDice(this.beast.roleInfo[role].vitality)
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
            average: this.calculatorService.calculateAverageOfDice(vitality),
            rolled: this.calculatorService.rollDice(vitality)
          }
          this.trauma = Math.max(this.trauma, this.locationCheckboxes[id].average)
          this.locationCheckboxes[id].checkboxes = this.createCheckboxArray(this.locationCheckboxes[id].average)
        })
      }

      this.trauma = +(this.trauma / 2).toFixed(0);

      this.getLairLoot()

      this.beastService.getEquipment().subscribe(res => {
        this.equipmentLists = res.lists
        this.equipmentObjects = res.objects
      })

      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      }

      this.convertFatigue()
      this.convertPanic()

      let roleParameter = this.router.url.split('/')[4]
      if (roleParameter) {
        this.setRoleViaParameter(roleParameter)
      } else {
        this.setRoleToDefault()
      }
    })
  }

  setMonsterNumber = (event) => {
    if (+event.target.value < 1) {
      event.target.value = 1
    } else if (+event.target.value > 25) {
      event.target.value = 25
    }
    this.monsterNumber = +event.target.value
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
      for (let i = 0; i < alms.length * timesToRoll; i++) {
        let favor = rollDice(almsFavor[alms[i].favor])
          , number = rollDice(numberAppearing[alms[i].number])
        if (number > 0) {
          this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
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
      for (let i = 0; i < scrolls.length * timesToRoll; i++) {
        let power = rollDice(scrollPower[scrolls[i].power])
          , number = rollDice(numberAppearing[scrolls[i].number])
        if (number > 0) {
          this.lairLoot.push(`${number} scroll${number > 1 ? 's' : ''} (${power} SP)`)
        }
      }
    }

    if (traited.length > 0) {
      for (let y = 0; y < timesToRoll; y++) {
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
    }

    if (equipment.length > 0) {
      for (let i = 0; i < equipment.length * timesToRoll; i++) {
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
    this.beastService.getRandomEncounter(this.beast.id).subscribe((result: any) => {
      if (result.temperament && result.rank) {
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
            for (let i = 0; i < dedupedArray.length; i++) {
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

    if (isNaN(price)) {
      return 'Priceless'
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
    console.log(param)
    for (let i = 0; i < this.beast.roles.length; i++) {
      let role = this.beast.roles[i]
      if (role.name.replace(/\s|-/g, '').toUpperCase() === uppercaseParam || param === role.id) {
        this.setRole({value: role.id})
      }
    }
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

    let percentage = .00;
    switch (panic) {
      case 1:
        this.numberPanic = 'Always';
      case 2:
        this.numberPanic = 1
      case 3:
        percentage = .25
        break;
      case 4:
        percentage = .5
        break;
      case 5:
        percentage = .75
        break;
      case 7:
        this.numberPanic = 'Never'
      default: panic
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

    this.numberPanic = (stress * percentage).toFixed(0)
  }

  convertFatigue() {
    let { combat, basefatigue } = this.beast
    let armor = null;
    let weaponFatigue = null
    let displayedFatigue = null

    if (basefatigue) {
      displayedFatigue = basefatigue;
    } else {
      for (let i = 0; i < combat.length; i++) {
        let weapon = combat[i]
        if (weapon.roleid === this.selectedRoleId) {
          weaponFatigue = weapon.fatigue
          armor = weapon.selectedarmor
          i = combat.length
        }
      }

      displayedFatigue = armor ? armor.fatigue : this.selectedRole ? this.selectedRole.fatigue : weaponFatigue ? weaponFatigue : 'C';
    }

    let vitality

    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].average) {
      vitality = this.beast.roleInfo[this.selectedRoleId].average
    } else {
      vitality = this.locationCheckboxes.mainVitality.average
    }

    if (isNaN(vitality)) {
      this.numberFatigue = 'N'
    }
    switch (displayedFatigue) {
      case 'A':
        this.numberFatigue = 'A'
        break;
      case 'H':
        this.numberFatigue = 1
        break
      case 'B':
        this.numberFatigue = (vitality * .25).toFixed(0)
        break;
      case 'W':
        this.numberFatigue = (vitality * .5).toFixed(0)
        break;
      case 'C':
        this.numberFatigue = (vitality * .75).toFixed(0)
        break;
      case 'N':
        this.numberFatigue = 'N'
        break;
      default:
        this.numberFatigue = (vitality * .75).toFixed(0)
    }

    if (!this.displayedFatigue || this.displayedFatigue.length <= 1) {
      switch (displayedFatigue) {
        case 'A':
          this.displayedFatigue = "Always"
          break;
        case 'H':
          this.displayedFatigue = 'Hurt'
          break;
        case 'B':
          this.displayedFatigue = 'Bloodied'
          break;
        case 'W':
          this.displayedFatigue = 'Wounded'
          break;
        case 'C':
          this.displayedFatigue = 'Critical'
          break;
        case 'N':
          this.displayedFatigue = 'Never'
          break;
        default:
          this.displayedFatigue = 'Critical'
      }
    }
  }

  displayDR = (drObject, type, square) => {
    let { flat, slash } = drObject

    let equipmentModFlat = 0
    let equipmentModSlash = 0

    if (!square.showEquipmentSelection) {
      if (type === 'armor' && square.selectedarmor) {
        equipmentModFlat = square.armorInfo.dr.flat
        equipmentModSlash = square.armorInfo.dr.slash
      } else if (type === 'shield' && square.selectedshield) {
        equipmentModFlat = square.shieldInfo.dr.flat
        equipmentModSlash = square.shieldInfo.dr.slash
      } else if (this.selectedRoleId && square.addrolemods) {
        if (type === 'armor') {
          equipmentModFlat = this.selectedRole.dr.flat
          equipmentModSlash = this.selectedRole.dr.slash
        } else if (type === 'shield') {
          equipmentModFlat = this.selectedRole.shield_dr.flat
          equipmentModSlash = this.selectedRole.shield_dr.slash
        }
      }
    } else {
      if (type === 'armor' && this.newSelectedArmor) {
        equipmentModFlat = this.newArmorInfo.dr.flat
        equipmentModSlash = this.newArmorInfo.dr.slash
      } else if (type === 'shield' && this.newSelectedShield) {
        equipmentModFlat = this.newShieldInfo.dr.flat
        equipmentModSlash = this.newShieldInfo.dr.slash
      } else if (this.selectedRoleId & square.addrolemods) {
        if (type === 'armor') {
          equipmentModFlat = this.selectedRole.dr.flat
          equipmentModSlash = this.selectedRole.dr.slash
        } else if (type === 'shield') {
          equipmentModFlat = this.selectedRole.shield_dr.flat
          equipmentModSlash = this.selectedRole.shield_dr.slash
        }
      }
    }

    let adjustedFlat = flat + equipmentModFlat
    let adjustedSlash = slash + equipmentModSlash
    let drString = ''

    if (adjustedFlat && adjustedSlash) {
      drString = `${adjustedSlash}/d +${adjustedFlat}`
    } else if (adjustedFlat && !adjustedSlash) {
      drString = `${adjustedFlat}`
    } else if (!adjustedFlat && adjustedSlash) {
      drString = `${adjustedSlash}/d`
    }

    return drString === '' ? 0 : drString
  }

  displayDamage = (square) => {
    let roleDamage = null

    if (!square.showEquipmentSelection) {
      if (!square.selectedweapon && !square.dontaddroledamage && square.addrolemods) {
        if (square.weapontype === 'm') {
          roleDamage = this.selectedRole.damage
        } else {
          roleDamage = this.selectedRole.rangedDamage
        }
      } else if (square.weaponInfo && !square.dontaddroledamage) {
        roleDamage = square.weaponInfo.damage
      }
    } else {
      if (!this.newSelectedWeapon && !square.dontaddroledamage && square.addrolemods) {
        if (square.weapontype === 'm') {
          roleDamage = this.selectedRole.damage
        } else {
          roleDamage = this.selectedRole.rangedDamage
        }
      } else if (this.newWeaponInfo && !square.dontaddroledamage) {
        roleDamage = this.newWeaponInfo.damage
      }
    }

    let squareDamage = square.newDamage

    let diceObject = {
      d3s: 0,
      d4s: 0,
      d6s: 0,
      d8s: 0,
      d10s: 0,
      d12s: 0,
      d20s: 0
    }

    if (roleDamage) {
      roleDamage.dice.forEach(dice => {
        let index = dice.indexOf("d")
          , substring = dice.substring(index)
        if (substring.includes('20')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d20s += +dice.substring(0, index)
          } else {
            ++diceObject.d20s
          }
        } else if (substring.includes('12')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d12s += +dice.substring(0, index)
          } else {
            ++diceObject.d12s
          }
        } else if (substring.includes('10')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d10s += +dice.substring(0, index)
          } else {
            ++diceObject.d10s
          }
        } else if (substring.includes('8')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d8s += +dice.substring(0, index)
          } else {
            ++diceObject.d8s
          }
        } else if (substring.includes('6')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d6s += +dice.substring(0, index)
          } else {
            ++diceObject.d6s
          }
        } else if (substring.includes('4')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d4s += +dice.substring(0, index)
          } else {
            ++diceObject.d4s
          }
        } else if (substring.includes('3')) {
          if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
            diceObject.d3s += +dice.substring(0, index)
          } else {
            ++diceObject.d3s
          }
        }
      })
    }

    squareDamage.dice.forEach(dice => {
      let index = dice.indexOf("d")
        , substring = dice.substring(index)
      if (substring.includes('20')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d20s += +dice.substring(0, index)
        } else {
          ++diceObject.d20s
        }
      } else if (substring.includes('12')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d12s += +dice.substring(0, index)
        } else {
          ++diceObject.d12s
        }
      } else if (substring.includes('10')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d10s += +dice.substring(0, index)
        } else {
          ++diceObject.d10s
        }
      } else if (substring.includes('8')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d8s += +dice.substring(0, index)
        } else {
          ++diceObject.d8s
        }
      } else if (substring.includes('6')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d6s += +dice.substring(0, index)
        } else {
          ++diceObject.d6s
        }
      } else if (substring.includes('4')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d4s += +dice.substring(0, index)
        } else {
          ++diceObject.d4s
        }
      } else if (substring.includes('3')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d3s += +dice.substring(0, index)
        } else {
          ++diceObject.d3s
        }
      }
    })

    let crushingDamageMod = 0
    let damagetype = square.selectedweapon ? square.weaponInfo.type : square.damagetype
    if (square.damageskill) {
      if (damagetype === 'S') {
        diceObject.d4s += Math.floor(square.damageskill / 2)
        let leftover = square.damageskill % 2
        if (leftover === 1) {
          diceObject.d3s += 1
        }
      } else if (damagetype === 'P') {
        diceObject.d8s += Math.floor(square.damageskill / 4)
        let leftover = square.damageskill % 4
        if (leftover === 1) {
          diceObject.d3s += 1
        } else if (leftover === 2) {
          diceObject.d4s += 1
        } else if (leftover === 3) {
          diceObject.d6s += 1
        }
      } else {
        crushingDamageMod = square.damageskill
      }
    }

    let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

    let diceString = ''

    if (d3s > 0) {
      diceString += `${d3s}d3!`
    }
    if (d4s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
    }
    if (d6s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
    }
    if (d8s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
    }
    if (d10s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
    }
    if (d12s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
    }
    if (d20s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
    }

    let modifier = squareDamage.flat
    if (roleDamage) {
      modifier = roleDamage.flat + squareDamage.flat
    }

    let staticRoleDamage = this.selectedRole && !square.dontaddroledamage && square.addrolemods ? this.selectedRole.damagebonus : 0
    if (modifier + crushingDamageMod + staticRoleDamage > 0) {
      diceString += ` +${modifier + crushingDamageMod + staticRoleDamage}`
    } else if (modifier + crushingDamageMod + staticRoleDamage < 0) {
      diceString += ` ${modifier + crushingDamageMod + staticRoleDamage}`
    }

    return diceString + (square.hasspecialanddamage ? '*' : '')
  }

  displayName = (square) => {
    if (square.weapon !== '') {
      let first = square.weapon.indexOf("(")
      let second = square.weapon.indexOf(")", first + 1)
      if (square.damagetype && square.weapon.includes('(') && (second - first + 1) === 1) {
        return `${square.weapon.slice(0, -4)}`
      }
      return square.weapon
    }
    let { selectedweapon, selectedarmor, selectedshield } = square

    if (selectedweapon && selectedweapon.includes('(')) {
      selectedweapon = `${selectedweapon.slice(0, -4)}`
    }

    if (selectedweapon && selectedarmor && selectedshield) {
      return `${selectedweapon}, ${selectedarmor}, & ${selectedshield}`
    } else if (selectedweapon && selectedarmor && !selectedshield) {
      return `${selectedweapon} & ${selectedarmor}`
    } else if (selectedweapon && !selectedarmor && selectedshield) {
      return `${selectedweapon} & ${selectedshield}`
    } else if (selectedweapon && !selectedarmor && !selectedshield) {
      return `${selectedweapon}`
    } else if (!selectedweapon && selectedarmor && selectedshield) {
      return `${selectedarmor}, & ${selectedshield}`
    } else if (!selectedweapon && selectedarmor && !selectedshield) {
      return `${selectedarmor}`
    } else if (!selectedweapon && !selectedarmor && selectedshield) {
      return `${selectedshield}`
    } else {
      return ' '
    }
  }

  evaluateDefense = (square) => {
    let defMod = square.def
    if (typeof (defMod) === 'string' && defMod.includes('+')) {
      defMod = +defMod.replace('/+/gi', '')
    }

    let defBase = this.selectedRole.def && square.addrolemods ? this.selectedRole.def : 0
    if (square.selectedshield) {
      defBase += square.shieldInfo.def
    }
    if (square.selectedarmor) {
      defBase += square.armorInfo.def
    }
    return defBase + +defMod + this.returnSizeDefenseModifier(square)
  }

  returnSizeMeasureModifier = (square) => {
    if (!square.addsizemod) {
      return 0
    }
    switch (this.beast.size) {
      case "Fine":
        return -4
      case "Diminutive":
        return -3
      case "Tiny":
        return -2
      case "Small":
        return -1
      case "Medium":
        return 0
      case "Large":
        return 1
      case "Huge":
        return 2
      case "Giant":
        return 3
      case "Enormous":
        return 4
      case "Colossal":
        return 5
      default:
        return 0
    }
  }

  returnSizeDefenseModifier = (square) => {
    if (!square.addsizemod) {
      return 0
    }
    switch (this.beast.size) {
      case "Fine":
        return 12
      case "Diminutive":
        return 9
      case "Tiny":
        return 6
      case "Small":
        return 3
      case "Medium":
        return 0
      case "Large":
        return -3
      case "Huge":
        return -6
      case "Giant":
        return -9
      case "Enormous":
        return -12
      case "Colossal":
        return -15
      default:
        return 0
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
      this.showAllEquipment = this.turnOnAllEquipment()
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
    console.log(square)
    console.log(this.beast.specialAbilities.generic)
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

  turnOnAllEquipment = () => {
    let turnOnWeapons = true
    let turnOnArmor = true
    let turnOnShields = true
    if (this.selectedRole.weapons || this.selectedRole.armor || this.selectedRole.shields) {
      if (this.newSelectedWeapon) {
        this.selectedRole.weapons.forEach(weaponCat => {
          let result = weaponCat.items.includes(`${this.newSelectedWeapon} (${this.newWeaponInfo.type})`)
          if (result) {
            turnOnWeapons = false
          }
        })
      }
      if (this.newSelectedArmor) {
        this.selectedRole.armor.forEach(armorCat => {
          if (armorCat.items) {
            let result = armorCat.items.includes(this.newSelectedArmor)
            if (result) {
              turnOnArmor = false
            }
          }
        })
      }
      if (this.newSelectedShield) {
        this.selectedRole.shields.forEach(shieldCat => {
          if (shieldCat.items) {
            let result = shieldCat.items.includes(this.newSelectedShield)
            if (result) {
              turnOnShields = false
            }
          }
        })
      }
    }

    return (turnOnWeapons && turnOnArmor && turnOnShields)
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

  tooltipName(combatrole, secondarycombat, socialrole, skillrole) {
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
        nameString += `(${secondarycombat})`
      }
    }
    if (socialrole) {
      if (nameString.length > name.length + 3) {
        nameString += '/'
      }
      nameString += `${socialrole}`
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

  calculateRecovery(spdbonus = 0, selectedweapon, weaponInfo = { rec: 0 }, addrolemods = true, rolespeed = 0, squarespd = 0, selectedarmor, armorInfo = { rec: 0 }) {
    if (!addrolemods) {
      spdbonus = 0
      rolespeed = 0
    }

    if (!selectedarmor) {
      armorInfo.rec = 0
    }

    if (selectedweapon) {
      return weaponInfo.rec + +spdbonus + squarespd + armorInfo.rec
    } else {
      return rolespeed + squarespd + armorInfo.rec
    }
  }
}
