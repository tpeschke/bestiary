import { Component, OnInit, Input } from '@angular/core';
import { int } from 'aws-sdk/clients/datapipeline';

@Component({
  selector: 'app-weapon-square',
  templateUrl: './weapon-square.component.html',
  styleUrls: ['./weapon-square.component.css', '../../beast-view.component.css']
})
export class WeaponSquareComponent implements OnInit {

  @Input() square: any;
  @Input() selectedRole: any;
  @Input() selectedRoleId: string;
  @Input() updateCombatPoints: Function;
  @Input() index: int;
  @Input() removeNewSecondaryItem: Function;

  constructor() { }

  public displayedDamage = ''
  public displayedDR = ''
  public displayedShieldDR = ''
  public squareDamageArray = []

  ngOnInit() {
    this.displayDamage()
    this.displayedDR = this.displayDR(this.square.newDR, 'armor')
    this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
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
        this.displayDamage()
      } else if (primary === 'newDR') {
        this.displayedDR = this.displayDR(this.square.newDR, 'armor')
      } else if (primary === 'newShieldDr') {
        this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
      }
    } else {
      this.square[primary] = +event.target.value
    }
  }

  captureSelect(event, type) {
    this.updateNonIntCombatValues(type, null, event.value)
    if (type === 'weapontype' && !this.square.ranges) {
      this.square.ranges = { increment: 0 }
    }
    this.square[type] = event.value
    if (type === 'weapontype' || type === 'selectedweapon') {
      this.displayDamage()
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

    this.displayDamage()
  }

  removeChip = (type) => {
    let { dice } = this.square.newDamage

    this.updateNonIntCombatValues('damage dice', 'remove', type)
    for (let i = 0; i < dice.length; i++) {
      let positionType = dice[i].split('d')[1]
      if (positionType === type + '!') {
        let number = dice[i].split('d')[0]
        if (number !== '' && number !== '1') {
          dice[i] = `${+number - 1}d${type}!`
        } else {
          dice.splice(i, 1)
        }
        i = dice.length
      }
    }

    this.displayDamage()
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
      default:
        valueChange = 0
        console.log('couldn\'t find ' + metricToCompare)
    }

    this.updateCombatPoints(valueChange)
  }

  updateNonIntCombatValues = (primary, secondary, value) => {
    if (primary !== 'weapontype') {
      if (primary === 'fatigue') {
        this.updateCombatPoints(this.getFatigueValue(value) - this.getFatigueValue(this.square.fatigue));
      } else if (primary === 'damage dice' && secondary === 'add') {
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

        this.updateCombatPoints(valueToAdd)
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

        this.updateCombatPoints(valueToSubtract)
      }
    }

  }

  getFatigueValue = (fatigue) => {
    switch (fatigue) {
      case 'A':
        return -4;
      case 'H':
        return -4;
      case 'B':
        return -4;
      case 'W':
        return -4;
      case 'C':
        return 0;
      case 'N':
        return 4;
    }
  }

  checkCheckbox = (type, value) => {
    this.square.newDamage[type] = value
  }

  evaluate = (one, two) => {
    if (typeof(two) === 'string' && two.includes('+')) {
      two = +two.replace('/+/gi', '')
    }
    return eval(one + +two)
  }

  displayDR = (drObject, type) => {
    let { flat, slash } = drObject
      , drString = ''
    if (flat && slash) {
      drString = `${slash}/d+${flat}`
    } else if (flat && !slash) {
      drString = `${flat}`
    } else if (!flat && slash) {
      drString = `${slash}/d`
    }

    if (type === 'armor') {
      this.square.dr = drString
    } else {
      this.square.shield_dr = drString
    }

    return drString
  }

  displayDamage = () => {
    let roleDamage = null
    if (!this.square.selectedweapon) {
      if (this.square.weapontype === 'm') {
        roleDamage = this.selectedRole.damage
      } else {
        roleDamage = this.selectedRole.rangedDamage
      }
    } else {
      roleDamage = this.square.weaponInfo.damage
    }

    let squareDamage = this.square.newDamage

    let diceObject = {
      d3s: 0,
      d4s: 0,
      d6s: 0,
      d8s: 0,
      d10s: 0,
      d12s: 0,
      d20s: 0
    }
    let justSquareDamageObject = {
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
          justSquareDamageObject.d20s += +dice.substring(0, index)
        } else {
          ++diceObject.d20s
          ++justSquareDamageObject.d20s
        }
      } else if (substring.includes('12')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d12s += +dice.substring(0, index)
          justSquareDamageObject.d12s += +dice.substring(0, index)
        } else {
          ++diceObject.d12s
          ++justSquareDamageObject.d12s
        }
      } else if (substring.includes('10')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d10s += +dice.substring(0, index)
          justSquareDamageObject.d10s += +dice.substring(0, index)
        } else {
          ++diceObject.d10s
          ++justSquareDamageObject.d10s
        }
      } else if (substring.includes('8')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d8s += +dice.substring(0, index)
          justSquareDamageObject.d8s += +dice.substring(0, index)
        } else {
          ++diceObject.d8s
          ++justSquareDamageObject.d8s
        }
      } else if (substring.includes('6')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d6s += +dice.substring(0, index)
          justSquareDamageObject.d6s += +dice.substring(0, index)
        } else {
          ++diceObject.d6s
          ++justSquareDamageObject.d6s
        }
      } else if (substring.includes('4')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d4s += +dice.substring(0, index)
          justSquareDamageObject.d4s += +dice.substring(0, index)
        } else {
          ++diceObject.d4s
          ++justSquareDamageObject.d4s
        }
      } else if (substring.includes('3')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d3s += +dice.substring(0, index)
          justSquareDamageObject.d3s += +dice.substring(0, index)
        } else {
          ++diceObject.d3s
          ++justSquareDamageObject.d3s
        }
      }
    })

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

    let { d3s: squared3s, d4s: squared4s, d6s: squared6s, d8s: squared8s, d10s: squared10s, d12s: squared12s, d20s: squared20s } = justSquareDamageObject
      , squareDamageString = ''
    this.squareDamageArray = []

    if (squared3s > 0) {
      this.squareDamageArray.push({ number: squared3s, type: '3' })
      squareDamageString += `${squared3s}d3!`
    }
    if (squared4s > 0) {
      this.squareDamageArray.push({ number: squared4s, type: '4' })
      squareDamageString += `${squared4s}d4!`
    }
    if (squared6s > 0) {
      this.squareDamageArray.push({ number: squared6s, type: '6' })
      squareDamageString += `${squared6s}d6!`
    }
    if (squared8s > 0) {
      this.squareDamageArray.push({ number: squared8s, type: '8' })
      squareDamageString += `${squared8s}d8!`
    }
    if (squared10s > 0) {
      this.squareDamageArray.push({ number: squared10s, type: '10' })
      squareDamageString += `${squared10s}d10!`
    }
    if (squared12s > 0) {
      this.squareDamageArray.push({ number: squared12s, type: '12' })
      squareDamageString += `${squared12s}d12!`
    }
    if (squared20s > 0) {
      this.squareDamageArray.push({ number: squared20s, type: '20' })
      squareDamageString += `${squared20s}d20!`
    }

    let modifier = squareDamage.flat
    if (roleDamage) {
      modifier = roleDamage.flat + squareDamage.flat
    }

    if (squareDamage.flat > 0) {
      squareDamageString += ` +${squareDamage.flat}`
    } else if (squareDamage.flat < 0) {
      squareDamageString += ` ${squareDamage.flat}`
    }

    if (modifier > 0) {
      diceString += ` +${modifier}`
    } else if (modifier < 0) {
      diceString += ` ${modifier}`
    }

    this.square.damage = squareDamageString
    this.displayedDamage = diceString + (this.square.newDamage.hasSpecialAndDamage ? '*' : '')
  }
}
