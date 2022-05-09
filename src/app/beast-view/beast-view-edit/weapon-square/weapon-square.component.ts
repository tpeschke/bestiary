import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-weapon-square',
  templateUrl: './weapon-square.component.html',
  styleUrls: ['./weapon-square.component.css', '../../beast-view.component.css']
})
export class WeaponSquareComponent implements OnInit {

  @Input() square: any;
  @Input() selectedRole: any;
  @Input() selectedRoleId: string;

  constructor() { }

  public displayedDamage = ''
  public displayedDR = ''
  public displayedShieldDR = ''
  public squareDamageArray = []

  ngOnInit() {
    console.log(this.square)
    this.displayDamage(this.selectedRole.damage, this.square.newDamage)
    this.displayedDR = this.displayDR(this.square.newDR, 'armor')
    this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
  }

  captureInput = (event, primary, secondary) => {
    if (secondary) {
      this.square[primary][secondary] = event.target.value
    } else {
      this.square[primary] = event.target.value
    }
  }

  captureInputNumber = (event, primary, secondary) => {
    if (secondary) {
      this.square[primary][secondary] = +event.target.value
      if (primary === 'newDamage' && secondary === 'flat') {
        this.displayDamage(this.selectedRole.damage, this.square.newDamage)
      } else if (primary === 'newDR') {
        this.displayedDR = this.displayDR(this.square.newDR, 'armor')
      } else if (primary === 'newShieldDr') {
        this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
      }
    } else {
      this.square[primary] = +event.target.value
    }
  }

  evaluate = (one, two) => {
    if (two >= 0 && !two.includes('+')) {
      two = `+${two}`
    }
    return eval(one + two)
  }

  displayDR = (drObject, type) => {
    let {flat, slash} = drObject
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

  displayDamage = (roleDamage, squareDamage) => {
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

    let modifier = roleDamage.flat + squareDamage.flat

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
    this.displayedDamage = diceString
  }

  addChip = (type) => {
    let diceAdd = false
      , { dice } = this.square.newDamage

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

    this.displayDamage(this.selectedRole.damage, this.square.newDamage)
  }

  removeChip = (type) => {
    let { dice } = this.square.newDamage

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

    this.displayDamage(this.selectedRole.damage, this.square.newDamage)
  }
}
