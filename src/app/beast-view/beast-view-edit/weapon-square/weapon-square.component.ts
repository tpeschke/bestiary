import { Component, OnInit, Input } from '@angular/core';
import { int } from 'aws-sdk/clients/datapipeline';
import { BeastService } from 'src/app/util/services/beast.service';
import { DisplayServiceService } from 'src/app/util/services/displayService.service';
import roles from '../../roles.js'

@Component({
  selector: 'app-weapon-square',
  templateUrl: './weapon-square.component.html',
  styleUrls: ['./weapon-square.component.css', '../../beast-view.component.css']
})
export class WeaponSquareComponent implements OnInit {

  @Input() square: any;
  @Input() selectedRole: any;
  @Input() selectedRoleId: string;
  @Input() calculateCombatPoints: Function;
  @Input() index: int;
  @Input() removeNewSecondaryItem: Function;
  @Input() copyWeaponSquare: Function;
  @Input() roleVitality: any;
  @Input() mainVitality: any
  @Input() beastSize: any;
  @Input() secondaryRole: any;

  constructor(
    public beastService: BeastService,
    public displayService: DisplayServiceService
  ) { }

  public displayedDamage = ''
  public displayedDR: any = ''
  public displayedShieldDR: any = ''
  public displayedDefense = ''
  public squareDamageArray = []
  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }
  public showAllEquipment = false
  public controllerWeapons = roles.combatRoles.secondary.Controller.weapons

  ngOnInit() {
    this.displayService.turnOnAllEquipment(this.selectedRole, null, null, null)
    this.displayedDefense = this.displayService.evaluateDefense(this.square, this.selectedRole, this.beastSize)
    this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
    this.updateBothDisplayDRs()
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
    })
  }

  ngOnChanges(changes) {
    this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
    this.updateBothDisplayDRs()
  }

  captureInput = (event, primary, secondary) => {
    this.updateNonIntCombatValues(primary, secondary, event.target.value)
    if (secondary) {
      this.square[primary][secondary] = event.target.value
    } else {
      this.square[primary] = event.target.value
    }
  }

  captureInputNumber = (event, primary, secondary) => {
    this.updateCombatValue(primary, secondary, +event.target.value)
    if (secondary) {
      this.square[primary][secondary] = +event.target.value
      if (primary === 'newDamage' && secondary === 'flat') {
        this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
      } else if (primary === 'newDR') {
        this.displayedDR = this.displayService.displayDR(this.square.newDR, 'armor', this.square, this.selectedRole, null, null, null, null)
      } else if (primary === 'newShieldDr') {
        this.displayedShieldDR = this.displayService.displayDR(this.square.newShieldDr, 'shield', this.square, this.selectedRole, null, null, null, null)
      }
    } else {
      this.square[primary] = +event.target.value
      if (primary === 'def') {
        this.displayedDefense = this.displayService.evaluateDefense(this.square, this.selectedRole, this.beastSize)
      } else if (primary === 'damageskill') {
        this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
      }
    }
  }

  captureSelect(event, type) {
    this.updateNonIntCombatValues(type, null, event.value)
    if (type === 'weapontype' && !this.square.ranges) {
      this.square.ranges = { increment: 0 }
    }
    this.square[type] = event.value === 'None' ? null : event.value
    if (type === 'selectedweapon') {
      this.square.weaponInfo = this.equipmentObjects.weapons[this.square[type]]
      if (this.square.weaponInfo && this.square.weaponInfo.range) {
        this.square.weapontype = 'r'
        if (!this.square.ranges) {
          this.square.ranges = { increment: 0 }
        }
      } else {
        this.square.weapontype = 'm'
      }
    }
    if (type === 'weapontype' || type === 'selectedweapon') {
      this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
    }
    if (type === 'selectedarmor') {
      this.square.armorInfo = this.equipmentObjects.armor[this.square[type]]
      this.displayedDR = this.displayService.displayDR(this.square.newDR, 'armor', this.square, this.selectedRole, null, null, null, null)
    }
    if (type === 'selectedshield') {
      this.square.shieldInfo = this.equipmentObjects.shields[this.square[type]]
      this.displayedShieldDR = this.displayService.displayDR(this.square.newShieldDr, 'shield', this.square, this.selectedRole, null, null, null, null)
    }
  }

  addChip = (type) => {
    let diceAdd = false
      , { dice } = this.square.newDamage

    this.updateNonIntCombatValues('damage dice', 'add', type)
    if (dice.length == 0) {
      dice.push(`d${type}!`)
      diceAdd = true
    } else {
      for (let i = 0; i < dice.length; i++) {
        let positionType = dice[i].split('d')[1]
        if (+positionType > +type) {
          dice.splice(i - 1, 0, `d${type}!`);
          diceAdd = true
          i = dice.length
        } else if (positionType === type) {
          let number = dice[i].split('d')[0]
          if (number !== '') {
            dice[i] = `${+number + 1}d${type}!`
          } else {
            dice[i] = `2d${type}!`
          }
          diceAdd = true
          i = dice.length
        }
      }
    }

    if (!diceAdd) {
      dice.push(`d${type}!`)
    }

    this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
  }

  removeChip = (type) => {
    let { dice } = this.square.newDamage

    this.updateNonIntCombatValues('damage dice', 'remove', type)
    for (let i = 0; i < dice.length; i++) {
      let positionType = dice[i].split('d')[1]
      if (positionType === type + '!' || positionType === type) {
        let number = dice[i].split('d')[0]
        if (number !== '' && number !== '1') {
          dice[i] = `${+number - 1}d${type}!`
        } else {
          dice.splice(i, 1)
        }
        i = dice.length
      }
    }

    this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
  }

  updateCombatValue = (primary, secondary, value) => {
    let metricToCompare
      , valueToCompare
      , valueChange
    if (secondary) {
      metricToCompare = primary + ', ' + secondary
      valueToCompare = value - this.square[primary][secondary]
    } else {
      metricToCompare = primary
      valueToCompare = value - this.square[primary]
    }

    switch (metricToCompare) {
      case 'atk':
      case 'newDamage, flat':
      case 'newDR, flat':
      case 'def':
        valueChange = valueToCompare
        break;
      case 'spd':
        valueChange = valueToCompare * -2
        break;
      case 'measure':
      case 'newShieldDr, slash':
      case 'newShieldDr, flat':
      case 'parry':
        valueChange = valueToCompare * 2
        break;
      case 'newDR, slash':
        valueChange = valueToCompare * 4
        break;
      case 'ranges, increment':
        valueChange = Math.ceil(valueToCompare / 10)
        break;
      case 'damageskill':
        let damagetype = this.square.selectedweapon ? this.square.weaponInfo.type : this.square.damagetype
        if (damagetype === 'S') {
          valueChange = Math.ceil(this.square.damageskill / 2)
        } else if (damagetype === 'P') {
          valueChange = Math.ceil(this.square.damageskill / 4) * 2
        } else {
          valueChange = this.square.damageskill
        }
        break;
      default:
        valueChange = 0
        console.log('couldn\'t find ' + metricToCompare)
    }

    this.calculateCombatPoints()
  }

  returnPointValueForDamageSkills = () => {
    let damageType = this.square.selectedweapon ? this.square.weaponInfo.type : this.square.damagetype
    if (damageType === 'P') {
      return 2
    } else {
      return 1
    }
  }

  updateNonIntCombatValues = (primary, secondary, value) => {
    if (primary !== 'weapontype') {
      if (primary === 'damage dice' && secondary === 'add') {
        let valueToAdd = 0

        switch (+value) {
          case 3:
          case 4:
            valueToAdd = 1
            break;
          case 6:
          case 8:
            valueToAdd = 2
            break;
          case 10:
            valueToAdd = 3
            break;
          case 12:
            valueToAdd = 4
            break;
          case 20:
            valueToAdd = 6
            break;
          default:
            console.log('could\'t find ' + value + ' while adding damage dice')
        }

        this.calculateCombatPoints()
      } else if (primary === 'damage dice' && secondary === 'remove') {
        let valueToSubtract = 0

        switch (+value) {
          case 3:
          case 4:
            valueToSubtract = -1
            break;
          case 6:
          case 8:
            valueToSubtract = -2
            break;
          case 10:
            valueToSubtract = -3
            break;
          case 12:
            valueToSubtract = -4
            break;
          case 20:
            valueToSubtract = -6
            break;
          default:
            console.log('could\'t find ' + value + ' while removing damage dice')
        }

        this.calculateCombatPoints()
      }
    }

  }

  checkCheckbox = (type, value) => {
    if (type === 'showAllEquipment') {
      this.showAllEquipment = value
    } else if (type === 'dontaddroledamage') {
      this.square[type] = value
      this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
    } if (type === 'addrolemods') {
      this.square[type] = value
      this.displayedDefense = this.displayService.evaluateDefense(this.square, this.selectedRole, this.beastSize)
      this.updateBothDisplayDRs()
      this.displayedDamage = this.displayService.displayDamage(this.square, this.selectedRole, null, null)
    } if (type === 'addsizemod') {
      this.square[type] = value
    } if (type === 'showmaxparry') {
      this.square[type] = value
    } else {
      this.square.newDamage[type] = value
    }
  }

  updateBothDisplayDRs = () => {
    this.displayedDR = this.displayService.displayDR(this.square.newDR, 'armor', this.square, this.selectedRole, null, null, null, null)
    this.displayedShieldDR = this.displayService.displayDR(this.square.newShieldDr, 'shield', this.square, this.selectedRole, null, null, null, null)
  }

  addedDice() {
    let damagetype = this.square.selectedweapon ? this.square.weaponInfo.type : this.square.damagetype
    if (!this.square.damageskill) {
      return ''
    }
    if (this.square.damageskill) {
      if (damagetype === 'S') {
        let d3s = null
        let d4s = Math.floor(this.square.damageskill / 2)
        let leftover = this.square.damageskill % 2
        if (leftover === 1) {
          d3s = 1
        }
        let diceString = ''
        if (d4s > 0) {
          diceString += `+${d4s}d4!`
        }
        if (d3s > 0) {
          diceString += `+${d3s}d3!`
        }
        return diceString
      } else if (damagetype === 'P') {
        let d3s = null
        , d4s = null
        , d6s = null
        let d8s = Math.floor(this.square.damageskill / 4)
        let leftover = this.square.damageskill % 4
        if (leftover === 1) {
          d3s += 1
        } else if (leftover === 2) {
          d4s += 1
        } else if (leftover === 3) {
          d6s += 1
        }
        let diceString = ''
        if (d8s > 0) {
          diceString += `+${d8s}d8!`
        }
        if (d6s > 0) {
          diceString += `+${d6s}d6!`
        }
        if (d4s > 0) {
          diceString += `+${d4s}d4!`
        }
        if (d3s > 0) {
          diceString += `+${d3s}d3!`
        }
        return diceString
      } else {
        return `+${this.square.damageskill}`
      }
    }
    
  }
}
