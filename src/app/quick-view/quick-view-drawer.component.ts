import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { QuickViewService } from 'src/app/util/services/quick-view.service';
import roles from '../beast-view/roles.js'
import { MatExpansionPanel } from '@angular/material';
import { BeastService } from '../util/services/beast.service.js';

@Component({
  selector: 'app-quick-view-drawer',
  templateUrl: './quick-view-drawer.component.html',
  styleUrls: ['./quick-view-drawer.component.css']
})
export class QuickViewDrawerComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  constructor(
    private beastService: BeastService,
    private router: Router,
    private quickViewService: QuickViewService
  ) { }

  private quickViewListIsOpen = false
  private isTrackedInCombatCounter = false
  private beasts = this.quickViewService.quickViewArray

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }

  public newSelectedWeapon;
  public newWeaponInfo;
  public newSelectedArmor;
  public newArmorInfo
  public newSelectedShield;
  public newShieldInfo;
  public showAllEquipment;

  ngOnInit() { }

  toggleQuickViewList() {
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
    })

    this.quickViewListIsOpen = !this.quickViewListIsOpen
    if (!this.quickViewListIsOpen) {
      this.viewPanels.forEach(p => p.close());
    }
  }

  isNumber(val): boolean {
    return !isNaN(+val);
  }

  addAnotherVitality(beastIndex) {
    this.quickViewService.addAnotherVitalityToBeast(beastIndex)
  }

  removeVitality(beastIndex, vitalityIndex) {
    this.quickViewService.removeVitalityFromBeast(beastIndex, vitalityIndex)
  }

  checkCheckbox(event, index, location, beastIndex, vitalityIndex) {
    this.quickViewService.checkCheckbox(event, index, location, beastIndex, vitalityIndex)
  }

  trackedInCombatCounter(event) {
    this.isTrackedInCombatCounter = event.checked
  }

  goToEntry(beastId) {
    this.router.navigate([`/beast/${beastId}/gm`])
    this.quickViewListIsOpen = false;
  }

  convertPanic(stress, panic) {
    let percentage = .00;
    switch (panic) {
      case 1:
        return 'Always';
      case 2:
        return 1
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
        return 'Never'
      default: panic
    }

    return (stress * percentage).toFixed(0)
  }

  convertFatigue(vitality, fatigue) {
    if (isNaN(vitality)) {
      return 'N'
    }

    let percentage = .00;
    switch (fatigue) {
      case 'H':
        return 1
      case 'B':
        percentage = .25
        break;
      case 'W':
        percentage = .5
        break;
      case 'C':
        percentage = .75
        break;
      case 'N':
        return 'N'
      default:
        percentage = .75
    }

    return (vitality * percentage).toFixed(0)
  }

  displayDamage = (square, roleinfo) => {
    let roleDamage = null
    if (roleinfo) {
      if (!square.showEquipmentSelection) {
        if (!square.selectedweapon && !square.dontaddroledamage && square.addrolemods) {
          if (square.weapontype === 'm') {
            roleDamage = roleinfo.damage
          } else {
            roleDamage = roleinfo.rangedDamage
          }
        } else if (square.weaponInfo && !square.dontaddroledamage) {
          roleDamage = square.weaponInfo.damage
        }
      } else {
        if (!this.newSelectedWeapon && !square.dontaddroledamage && square.addrolemods) {
          if (square.weapontype === 'm') {
            roleDamage = roleinfo.damage
          } else {
            roleDamage = roleinfo.rangedDamage
          }
        } else if (this.newWeaponInfo && !square.dontaddroledamage) {
          roleDamage = this.newWeaponInfo.damage
        }
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
        diceObject.d4s += Math.ceil(square.damageskill / 2)
      } else if (damagetype === 'P') {
        diceObject.d8s += Math.ceil(square.damageskill / 4)
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

    if (modifier + crushingDamageMod > 0) {
      diceString += ` +${modifier + crushingDamageMod}`
    } else if (modifier < 0) {
      diceString += ` ${modifier + crushingDamageMod}`
    }

    return diceString + (square.hasspecialanddamage ? '*' : '')
  }

  displayDR = (drObject, type, square, roleinfo) => {
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
      } else if (roleinfo && square.addrolemods) {
        if (type === 'armor') {
          equipmentModFlat = roleinfo.dr.flat
          equipmentModSlash = roleinfo.dr.slash
        } else if (type === 'shield') {
          equipmentModFlat = roleinfo.shield_dr.flat
          equipmentModSlash = roleinfo.shield_dr.slash
        }
      }
    } else {
      if (type === 'armor' && this.newSelectedArmor) {
        equipmentModFlat = this.newArmorInfo.dr.flat
        equipmentModSlash = this.newArmorInfo.dr.slash
      } else if (type === 'shield' && this.newSelectedShield) {
        equipmentModFlat = this.newShieldInfo.dr.flat
        equipmentModSlash = this.newShieldInfo.dr.slash
      } else if (roleinfo && square.addrolemods) {
        if (type === 'armor') {
          equipmentModFlat = roleinfo.dr.flat
          equipmentModSlash = roleinfo.dr.slash
        } else if (type === 'shield') {
          equipmentModFlat = roleinfo.shield_dr.flat
          equipmentModSlash = roleinfo.shield_dr.slash
        }
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

  displayName = (square) => {
    if (square.weapon !== '') {
      if (square.damagetype && !square.weapon.includes('(')) {
        return `${square.weapon} (${square.damagetype})`
      }
      return square.weapon
    }
    let { selectedweapon, selectedarmor, selectedshield } = square

    if (selectedweapon && square.weaponInfo.type && !selectedweapon.includes('(')) {
      selectedweapon = `${selectedweapon} (${square.weaponInfo.type})`
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

  evaluateDefense = (square, roleinfo, size) => {
    let defMod = square.def
    if (typeof (defMod) === 'string' && defMod.includes('+')) {
      defMod = +defMod.replace('/+/gi', '')
    }

    let defBase = roleinfo && square.addrolemods ? roleinfo.def : 0
    if (square.selectedshield) {
      defBase += square.shieldInfo.def
    }
    if (square.selectedarmor) {
      defBase += square.armorInfo.def
    }
    return defBase + +defMod + this.returnSizeDefenseModifier(size, square.addsizemod)
  }

  returnSizeMeasureModifier = (size, addsizemod) => {
    if (!addsizemod) {
      return 0
    }
    switch (size) {
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

  returnSizeDefenseModifier = (size, addsizemod) => {
    if (!addsizemod) {
      return 0
    }
    switch (size) {
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

  toggleEquipmentSelection = (square, beast, beastIndex) => {
    if (!square.showEquipmentSelection) {
      this.newSelectedWeapon = square.selectedweapon
      this.newWeaponInfo = square.weaponInfo
      this.newSelectedArmor = square.selectedarmor
      this.newArmorInfo = square.armorInfo
      this.newSelectedShield = square.selectedshield
      this.newShieldInfo = square.shieldInfo
      this.showAllEquipment = this.turnOnAllEquipment(beast.roleinfo)
    } else if (square.showEquipmentSelection) {
      square.selectedweapon = this.newSelectedWeapon

      if (!this.beasts[beastIndex].specialAbilities) {
        this.beasts[beastIndex].specialAbilities = []
      }
      if (square.weaponInfo.bonusLong) {
        this.beasts[beastIndex].specialAbilities = this.beasts[beastIndex].specialAbilities.filter(bonus => bonus !== square.weaponInfo.bonusLong)
      }
      if (this.newWeaponInfo.bonusLong) {
        this.beasts[beastIndex].specialAbilities.push(this.newWeaponInfo.bonusLong)
      }
      if (square.shieldInfo.bonusLong) {
        this.beasts[beastIndex].specialAbilities = this.beasts[beastIndex].specialAbilities.filter(bonus => bonus !== square.shieldInfo.bonusLong)
      }
      if (this.newShieldInfo && this.newShieldInfo.bonusLong) {
        this.beasts[beastIndex].specialAbilities.push(this.newShieldInfo.bonusLong)
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

  turnOnAllEquipment = (roleInfo) => {
    let turnOnAllEquipment = true
    if (roleInfo.weapons || roleInfo.armor || roleInfo.shields) {
      if (this.newSelectedWeapon) {
        roleInfo.weapons.forEach(weaponCat => {
          let result = weaponCat.items.includes(this.newSelectedWeapon)
          if (result) {
            turnOnAllEquipment = false
          }
        })
      }
      if (this.newSelectedArmor) {
        roleInfo.armor.forEach(armorCat => {
          let result = armorCat.items.includes(this.newSelectedArmor)
          if (result) {
            turnOnAllEquipment = false
          }
        })
      }
      if (this.newSelectedShield) {
        roleInfo.shields.forEach(shieldCat => {
          let result = shieldCat.items.includes(this.newSelectedShield)
          if (result) {
            turnOnAllEquipment = false
          }
        })
      }
    }

    return turnOnAllEquipment
  }

  checkShowAllEquipment = (checked) => {
    this.showAllEquipment = checked
  }
}
