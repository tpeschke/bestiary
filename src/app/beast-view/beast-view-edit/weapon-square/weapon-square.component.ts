import { Component, OnInit, Input } from '@angular/core';
import { int } from 'aws-sdk/clients/datapipeline';
import { BeastService } from 'src/app/util/services/beast.service';

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
  @Input() copyWeaponSquare: Function;
  @Input() roleVitality: any;
  @Input() mainVitality: any
  @Input() beastSize: any;

  constructor(
    public beastService: BeastService
  ) { }

  public displayedDamage = ''
  public displayedDR: any = ''
  public displayedShieldDR: any = ''
  public displayedDefense = ''
  public squareDamageArray = []
  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }
  public showAllEquipment = false

  ngOnInit() {
    this.turnOnAllEquipment()
    this.evaluateDefense()
    this.displayDamage()
    this.updateBothDisplayDRs()
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
    })
  }

  ngOnChanges(changes) {
    this.displayDamage()
    this.updateBothDisplayDRs()
  }

  turnOnAllEquipment = () => {
    let turnOnWeapons = true
    let turnOnArmor = true
    let turnOnShields = true
    if (this.selectedRole.weapons || this.selectedRole.armor || this.selectedRole.shields) {
      if (this.square.selectedweapon) {
        this.selectedRole.weapons.forEach(weaponCat => {
          let result = weaponCat.items.includes(this.square.selectedweapon)
          if (result) {
            turnOnWeapons = false
          }
        })
      } else {
        turnOnWeapons = false
      }
      if (this.square.selectedarmor) {
        this.selectedRole.armor.forEach(armorCat => {
          if (armorCat.items) {
            let result = armorCat.items.includes(this.square.selectedarmor)
            if (result) {
              turnOnArmor = false
            }
          }
        })
      } else {
        turnOnArmor = false
      }
      if (this.square.selectedshield) {
        this.selectedRole.shields.forEach(shieldCat => {
          if (shieldCat.items) {
            let result = shieldCat.items.includes(this.square.selectedshield)
            if (result) {
              turnOnShields = false
            }
          }
        })
      } else {
        turnOnShields = false
      }
      this.showAllEquipment = (turnOnWeapons && turnOnArmor && turnOnShields)
    } else {
      this.showAllEquipment = false
    }
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
      if (primary === 'def') {
        this.evaluateDefense()
      } else if (primary === 'damageskill') {
        this.displayDamage()
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
      this.displayDamage()
    }
    if (type === 'selectedarmor') {
      this.square.armorInfo = this.equipmentObjects.armor[this.square[type]]
      this.displayedDR = this.displayDR(this.square.newDR, 'armor')
    }
    if (type === 'selectedshield') {
      this.square.shieldInfo = this.equipmentObjects.shields[this.square[type]]
      this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
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

    this.updateCombatPoints(valueChange)
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

  checkCheckbox = (type, value) => {
    if (type === 'showAllEquipment') {
      this.showAllEquipment = value
    } else if (type === 'dontaddroledamage') {
      this.square[type] = value
      this.displayDamage()
    } if (type === 'addrolemods') {
      this.square[type] = value
      this.evaluateDefense()
      this.updateBothDisplayDRs()
      this.displayDamage()
    } if (type === 'addsizemod') {
      this.square[type] = value
    } if (type === 'showmaxparry') {
      this.square[type] = value
    } else {
      this.square.newDamage[type] = value
    }
  }

  evaluateDefense = () => {
    let defMod = this.square.def
    if (typeof (defMod) === 'string' && defMod.includes('+')) {
      defMod = +defMod.replace('/+/gi', '')
    }

    let defBase = this.selectedRole.def && this.square.addrolemods ? this.selectedRole.def : 0
    if (this.square.selectedshield) {
      defBase += this.square.shieldInfo.def
    }
    if (this.square.selectedarmor) {
      defBase += this.square.armorInfo.def
    }
    this.displayedDefense = defBase + +defMod + this.returnSizeDefenseModifier()
  }

  updateBothDisplayDRs = () => {
    this.displayedDR = this.displayDR(this.square.newDR, 'armor')
    this.displayedShieldDR = this.displayDR(this.square.newShieldDr, 'shield')
  }

  displayDR = (drObject, type) => {
    let { flat, slash } = drObject

    let strightString = ''
    if (flat && slash) {
      strightString = `${slash}/d+${flat}`
    } else if (flat && !slash) {
      strightString = `${flat}`
    } else if (!flat && slash) {
      strightString = `${slash}/d`
    }

    if (type === 'armor') {
      this.square.dr = strightString
    } else {
      this.square.shield_dr = strightString
    }

    let equipmentModFlat = 0
    let equipmentModSlash = 0

    if (type === 'armor' && this.square.selectedarmor) {
      equipmentModFlat = this.square.armorInfo.dr.flat
      equipmentModSlash = this.square.armorInfo.dr.slash
    } else if (type === 'shield' && this.square.selectedshield) {
      equipmentModFlat = this.square.shieldInfo.dr.flat
      equipmentModSlash = this.square.shieldInfo.dr.slash
    } else if (this.selectedRoleId && this.square.addrolemods) {
      if (type === 'armor') {
        equipmentModFlat = this.selectedRole.dr.flat
        equipmentModSlash = this.selectedRole.dr.slash
      } else if (type === 'shield') {
        equipmentModFlat = this.selectedRole.shield_dr.flat
        equipmentModSlash = this.selectedRole.shield_dr.slash
      }
    }

    let adjustedFlat = flat + equipmentModFlat
    let adjustedSlash = slash + equipmentModSlash
    let drString = ''

    if (adjustedFlat && adjustedSlash) {
      drString = `${adjustedSlash}/d+${adjustedFlat}`
    } else if (adjustedFlat && !adjustedSlash) {
      drString = `${adjustedFlat}`
    } else if (!adjustedFlat && adjustedSlash) {
      drString = `${adjustedSlash}/d`
    }

    return drString === '' ? 0 : drString
  }

  displayDamage = () => {
    let roleDamage = null
    if (!this.square.selectedweapon && this.square.addrolemods && !this.square.dontaddroledamage) {
      if (this.square.weapontype === 'm') {
        roleDamage = this.selectedRole.damage
      } else {
        roleDamage = this.selectedRole.rangedDamage
      }
    } else if (this.square.weaponInfo && !this.square.dontaddroledamage) {
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

    let crushingDamageMod = 0
    let damagetype = this.square.selectedweapon ? this.square.weaponInfo.type : this.square.damagetype
    if (this.square.damageskill) {
      if (damagetype === 'S') {
        diceObject.d4s += Math.floor(this.square.damageskill / 2)
        let leftover = this.square.damageskill % 2
        if (leftover === 1) {
          diceObject.d3s += 1
        }
      } else if (damagetype === 'P') {
        diceObject.d8s += Math.floor(this.square.damageskill / 4)
        let leftover = this.square.damageskill % 4
        if (leftover === 1) {
          diceObject.d3s += 1
        } else if (leftover === 2) {
          diceObject.d4s += 1
        } else if (leftover === 4) {
          diceObject.d6s += 1
        }
      } else {
        crushingDamageMod = this.square.damageskill
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

    let staticRoleDamage = this.selectedRole && !this.square.dontaddroledamage && this.square.addrolemods ? this.selectedRole.damagebonus : 0
    if (modifier + crushingDamageMod + staticRoleDamage > 0) {
      diceString += ` +${modifier + crushingDamageMod + staticRoleDamage}`
    } else if (modifier + crushingDamageMod + staticRoleDamage < 0) {
      diceString += ` ${modifier + crushingDamageMod + staticRoleDamage}`
    }

    this.square.damage = squareDamageString
    this.displayedDamage = diceString + (this.square.newDamage.hasSpecialAndDamage ? '*' : '')
  }

  displayName = () => {
    let { selectedweapon, selectedarmor, selectedshield } = this.square

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

  addedDice() {
    let damagetype = this.square.selectedweapon ? this.square.weaponInfo.type : this.square.damagetype
    if (!this.square.damageskill) {
      return ''
    }
    if (damagetype === 'S') {
      return `+${Math.ceil(this.square.damageskill / 2)}d4!`
    } else if (damagetype === 'P') {
      return `+${Math.ceil(this.square.damageskill / 4)}d8!`
    } else {
      return `+${this.square.damageskill}`
    }
  }

  returnSizeMeasureModifier = () => {
    if (!this.square.addsizemod) {
      return 0
    }
    switch (this.beastSize) {
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

  returnSizeDefenseModifier = () => {
    if (!this.square.addsizemod) {
      return 0
    }
    switch (this.beastSize) {
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
}
