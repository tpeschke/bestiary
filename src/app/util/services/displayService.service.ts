import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayServiceService {

  constructor() { }

  displayName(square) {
    if (square.weapon !== '') {
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

  calculateAtk ({weapontype, addrolemods, atk}, roleinfo: any = {}) {
    let roleAtk = 0
    if (addrolemods && roleinfo.atk) {
      roleAtk = weapontype === 'm' ? roleinfo.atk : roleinfo.rangedAtk
    }

    return roleAtk + atk
  }

  turnOnAllEquipment = (roleInfo, newSelectedWeapon, newSelectedArmor, newSelectedShield) => {
    let turnOnAllEquipment = true
    if (roleInfo.weapons || roleInfo.armor || roleInfo.shields) {
      if (newSelectedWeapon) {
        roleInfo.weapons.forEach(weaponCat => {
          let result = weaponCat.items.includes(newSelectedWeapon)
          if (result) {
            turnOnAllEquipment = false
          }
        })
      }
      if (newSelectedArmor) {
        roleInfo.armor.forEach(armorCat => {
          if (armorCat.items) {
            let result = armorCat.items.includes(newSelectedArmor)
            if (result) {
              turnOnAllEquipment = false
            }
          }
        })
      }
      if (newSelectedShield) {
        roleInfo.shields.forEach(shieldCat => {
          if (shieldCat.items) {
            let result = shieldCat.items.includes(newSelectedShield)
            if (result) {
              turnOnAllEquipment = false
            }
          }
        })
      }
    }

    return turnOnAllEquipment
  }

  returnSizeDefenseModifier (size, addsizemod) {
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

  evaluateDefense = (square, roleinfo: any = {}, size) => {
    let defMod = square.def
    if (typeof (defMod) === 'string' && defMod.includes('+')) {
      defMod = +defMod.replace('/+/gi', '')
    }

    let defBase = roleinfo.def && square.addrolemods ? roleinfo.def : 0
    if (square.selectedshield) {
      defBase += square.shieldInfo.def
    }
    if (square.selectedarmor) {
      defBase += square.armorInfo.def
    }

    return defBase + +defMod + this.returnSizeDefenseModifier(size, square.addsizemod)
  }

  displayDR = (drObject, type, square, roleinfo: any = {}, newSelectedArmor, newArmorInfo, newShieldInfo, newSelectedShield) => {
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
      } else if (roleinfo.dr && square.addrolemods) {
        if (type === 'armor') {
          equipmentModFlat = roleinfo.dr.flat
          equipmentModSlash = roleinfo.dr.slash
        } else if (type === 'shield') {
          equipmentModFlat = roleinfo.shield_dr.flat
          equipmentModSlash = roleinfo.shield_dr.slash
        }
      }
    } else {
      if (type === 'armor' && newSelectedArmor) {
        equipmentModFlat = newArmorInfo.dr.flat
        equipmentModSlash = newArmorInfo.dr.slash
      } else if (type === 'shield' && newSelectedShield) {
        equipmentModFlat = newShieldInfo.dr.flat
        equipmentModSlash = newShieldInfo.dr.slash
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
      drString = `${adjustedSlash}/d +${adjustedFlat}`
    } else if (adjustedFlat && !adjustedSlash) {
      drString = `${adjustedFlat}`
    } else if (!adjustedFlat && adjustedSlash) {
      drString = `${adjustedSlash}/d`
    }

    return drString === '' ? 0 : drString
  }

  displayDamage = (square, roleinfo, newSelectedWeapon, newWeaponInfo) => {
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
        if (!newSelectedWeapon && !square.dontaddroledamage && square.addrolemods) {
          if (square.weapontype === 'm') {
            roleDamage = roleinfo.damage
          } else {
            roleDamage = roleinfo.rangedDamage
          }
        } else if (newWeaponInfo && !square.dontaddroledamage) {
          roleDamage = newWeaponInfo.damage
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

    let staticRoleDamage = roleinfo && !square.dontaddroledamage && square.addrolemods ? roleinfo.damagebonus : 0
    if (modifier + crushingDamageMod + staticRoleDamage > 0) {
      diceString += ` +${modifier + crushingDamageMod + staticRoleDamage}`
    } else if (modifier + crushingDamageMod + staticRoleDamage < 0) {
      diceString += ` ${modifier + crushingDamageMod + staticRoleDamage}`
    }

    return diceString + (square.hasspecialanddamage ? '*' : '')
  }

  getLetterFatigue(beast, selectedRoleId, roles) {
    let fatigue = 'C'
    if (selectedRoleId && beast.roleInfo[selectedRoleId].fatigue) {
      fatigue = beast.roleInfo[selectedRoleId].fatigue
    } else if (selectedRoleId && !beast.roleInfo[selectedRoleId].fatigue) {
      fatigue = beast.basefatigue
    } else if (selectedRoleId && roles.combatRoles.primary[beast.roleInfo[selectedRoleId].role].fatigue) {
      fatigue = roles.combatRoles.primary[beast.roleInfo[selectedRoleId].role].fatigue
    }

    return fatigue
  }

  getFullFatigueWord (fatigueLetter) {
    switch (fatigueLetter) {
      case 'A':
        return 'Always'
      case 'H':
        return 'Hurt'
      case 'B':
        return 'Bloodied'
        break;
      case 'W':
        return 'Wounded'
        break;
      case 'C':
        return 'Critical'
        break;
      case 'N':
        return 'Never'
      default:
        return 'Critical'
    }
  }

  convertFatigue({ combat, basefatigue, roleinfo }, averageVitality) {
    let armor = null;
    let weaponFatigue = null
    let displayedFatigue = armor ? armor.fatigue : roleinfo ? roleinfo.fatigue :  weaponFatigue ? weaponFatigue : 'C';
    if (basefatigue) {
      displayedFatigue = basefatigue;
    } else if (combat.length > 0) {
      weaponFatigue = combat[0].fatigue
      armor = combat[0].selectedarmor
    } else {
      displayedFatigue = 'C'
    }

    if (isNaN(averageVitality)) {
      return 'C'
    }
    let percentage = .00;
    switch (displayedFatigue) {
      case 'A':
        return 'Always'
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
        return 'Never'
      default:
        percentage = .75
    }

    return (averageVitality * percentage).toFixed(0)
  }

  convertPanic(stress, panic) {
    let percentage = .00;
    switch (panic) {
      case 1:
        return 'A';
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
        return 'N'
      default: panic
    }

    return (stress * percentage).toFixed(0)
  }
}
