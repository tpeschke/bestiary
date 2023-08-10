const roles = require('./roles')

const combatSquareController = {
    getSquare: (req, res) => {
        let combatSquare = {}
        // const roleInfo = 
console.log(req.params)
        res.send(combatSquare)
    }
}

getStatScaling = function (stat) {
    return scalingAndBases[stat]
}

getModifiedStats = function (stat, combatStats, roleInfo, points) {
    let scalingStrength;

    if (combatStats[stat]) {
        scalingStrength = combatStats[stat]
    } else {
        scalingStrength = roleInfo[stat]
    }

    const scaling = scalingAndBases[stat]
    const modifiedStat = getModifiedStat(scalingStrength, scaling, points)

    return modifiedStat
}

getModifiedWithWeapon = (combatStatKey, combatStats, roleInfo, equipmentObjects, weaponKey, points) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats[combatStatKey]) {
        scalingStrength = combatStats[combatStatKey]
    } else {
        scalingStrength = roleInfo[combatStatKey]
    }

    const scaling = scalingAndBases[combatStatKey]

    if (combatStats.weapon) {
        const equipmentStat = equipmentObjects.weapons[combatStats.weapon][weaponKey]
        if (scalingStrength === 'noneWk') {
            modifiedStat = equipmentStat - (scaling.none - scaling.majWk)
        } else if (scalingStrength === 'none' || !scalingStrength) {
            modifiedStat = equipmentStat
        } else {
            modifiedStat = equipmentStat + (scaling.bonus[scalingStrength] * points)
        }
    } else {
        modifiedStat = getModifiedStat(scalingStrength, scaling, points)
    }

    if (modifiedStat > 0) {
        return Math.floor(modifiedStat)
    }
    return 0
}

getArmorOrShieldStat = (stat, ArmorOrShield, weaponKey, combatStats, roleInfo, equipmentObjects, points) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats[stat]) {
        scalingStrength = combatStats[stat]
    } else {
        scalingStrength = roleInfo[stat]
    }

    const scaling = getStatScaling(stat)

    let equipmentStat
    if (ArmorOrShield === 'armor') {
        equipmentStat = equipmentObjects.armor[combatStats[ArmorOrShield]].dr[weaponKey]
    } else {
        equipmentStat = equipmentObjects.shields[combatStats[ArmorOrShield]].dr[weaponKey]
    }

    if (scalingStrength === 'noneWk') {
        modifiedStat = equipmentStat - (scaling.none - scaling.majWk)
    } else if (scalingStrength === 'none' || !scalingStrength) {
        modifiedStat = equipmentStat
    } else {
        modifiedStat = equipmentStat + (scaling.bonus[scalingStrength] * points)
    }

    return modifiedStat
}

getModifiedStat = (scalingStrength, scaling, points) => {
    if (scalingStrength === 'noneWk') {
        return scaling.scaling.majWk
    } else if (scalingStrength === 'none' || !scalingStrength) {
        return scaling.scaling.none
    } else {
        return scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * points)
    }
}

getMovementStats = function (stat, roleInfo, points) {
    let scalingStrength;

    if (stat) {
        scalingStrength = stat
    } else {
        scalingStrength = roleInfo.movement
    }

    const scaling = scalingAndBases.movement
    const modifiedStat = getModifiedStat(scalingStrength, scaling, points)

    return modifiedStat
}

getModifiedStatsRounded = function (stat, combatStats, roleInfo, points) {
    return Math.floor(getModifiedStats(stat, combatStats, roleInfo, points))
}

getModifiedStatsMinZero = function (stat, combatStats, roleInfo, points) {
    const modifiedStat = getModifiedStats(stat, combatStats, roleInfo, points)
    if (modifiedStat > 0) {
        return modifiedStat
    }
    return 0
}

getDamageScalingInfo = function (damageType) {
    if (damageType === 'C') {
        return scalingAndBases.crushingweapons
    } else if (damageType === 'P') {
        return scalingAndBases.piercingweapons
    } else if (damageType === 'S') {
        return scalingAndBases.slashingweapons
    }
}

getRecoveryFromDiceSize = function (diceSize) {
    return scalingAndBases.recovery.base[diceSize]
}

getModifiedMeasure = () => {
    let scalingStrength;
    let modifiedStat;

    if (this.combatStats.measure) {
      scalingStrength = this.combatStats.measure
    } else {
      scalingStrength = this.roleInfo.measure
    }

    const scaling = this.combatStatsService.getStatScaling('measure')

    if (this.combatStats.weapon) {
      const weaponMeasure = this.equipmentObjects.weapons[this.combatStats.weapon].measure
      if (scalingStrength === 'noneWk') {
        modifiedStat = weaponMeasure - (scaling.none - scaling.majWk)
      } else if (scalingStrength === 'none' || !scalingStrength) {
        modifiedStat = weaponMeasure
      } else {
        modifiedStat = weaponMeasure + (scaling.bonus[scalingStrength] * this.points)
      }
    } else {
      modifiedStat = this.combatStatsService.getModifiedStat(scalingStrength, scaling, this.points)
    }

    const measureModDictionary = {
      Fine: -4,
      Diminutive: -3,
      Tiny: -2,
      Small: -1,
      Medium: 0,
      Large: 1,
      Huge: 2,
      Giant: 3,
      Enormous: 4,
      Colossal: 5
    }

    if (!this.combatStats.addsizemod) {
      return modifiedStat
    }
    return modifiedStat + measureModDictionary[this.size]
  }

  getDefense = () => {
    const modifiedStat = this.combatStatsService.getModifiedStatsRounded('all', this.combatStats, this.roleInfo, this.points)
    if (!this.combatStats.addsizemod) {
      return modifiedStat
    }

    const defenseModDictionary = {
      Fine: 12,
      Diminutive: 9,
      Tiny: 6,
      Small: 3,
      Medium: 0,
      Large: -3,
      Huge: -6,
      Giant: -9,
      Enormous: -12,
      Colossal: -15
    }

    let equipmentMod = 0
    if (this.combatStats.armor) {
      equipmentMod += this.equipmentObjects.armor[this.combatStats.armor].def
    }
    if (this.combatStats.shield) {
      equipmentMod += this.equipmentObjects.shields[this.combatStats.shield].def
    }
    
    return modifiedStat + defenseModDictionary[this.size] + equipmentMod
  }

  setDamageDice = () => {
    if (this.combatStats.weapon) {
      this.setWeaponDamage()
    } else {
      this.setNoWeaponDamage()
    }
  }

  getWeaponScalingStrength = () => {
    if (this.combatStats.piercingweapons) {
      return this.combatStats.piercingweapons
    } else if (this.combatStats.crushingweapons) {
      return this.combatStats.crushingweapons
    } else if (this.combatStats.slashingweapons) {
      return this.combatStats.slashingweapons
    } else if (this.roleInfo.damage) {
      return this.roleInfo.damage
    } else {
      return null
    }
  }

  setWeaponDamage = () => {
    if (this.combatStats.isspecial === 'yes') {
      this.damageString = '*'
      return false
    }

    let scalingStrength = this.getWeaponScalingStrength()

    this.damageType = this.equipmentObjects.weapons[this.combatStats.weapon].type

    const scaling = this.combatStatsService.getStatScaling('weapon')

    let modifiedPoints = this.combatStatsService.getModifiedStat(scalingStrength, scaling, this.points)

    if (modifiedPoints < 0) {
      modifiedPoints = 1
    }

    let crushingDamageMod = 0
    let diceObject = { ...this.equipmentObjects.weapons[this.combatStats.weapon].damageObj }

    if (this.damageType === 'S') {
      diceObject.d4s += Math.floor(modifiedPoints / 2)
      let leftover = modifiedPoints % 2
      if (leftover === 1) {
        diceObject.d3s += 1
      }
    } else if (this.damageType === 'P') {
      diceObject.d8s += Math.floor(modifiedPoints / 4)
      let leftover = modifiedPoints % 4
      if (leftover === 1) {
        diceObject.d3s += 1
      } else if (leftover === 2) {
        diceObject.d4s += 1
      } else if (leftover === 3) {
        diceObject.d6s += 1
      }
    } else {
      crushingDamageMod = modifiedPoints
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

    if (crushingDamageMod) {
      diceString += ` +${crushingDamageMod}`
    }

    this.baseRecovery = this.equipmentObjects.weapons[this.combatStats.weapon].rec
    this.setModifiedRecovery()

    if (this.combatStats.isspecial === 'kinda') {
      diceString += '*'
    }

    this.damageString = diceString
  }

  setNoWeaponDamage = () => {
    if (this.combatStats.isspecial === 'yes') {
      this.damageString = '*'
      return false
    }

    let scalingStrength;

    if (this.combatStats.piercingweapons) {
      scalingStrength = this.combatStats.piercingweapons
      this.damageType = 'P'
    } else if (this.combatStats.crushingweapons) {
      scalingStrength = this.combatStats.crushingweapons
      this.damageType = 'C'
    } else if (this.combatStats.slashingweapons) {
      scalingStrength = this.combatStats.slashingweapons
      this.damageType = 'S'
    } else {
      scalingStrength = this.roleInfo.damage
      if (this.roleInfo.preferreddamage === 'piercingweapons') {
        this.damageType = 'P'
      } else if (this.roleInfo.preferreddamage === 'crushingweapons') {
        this.damageType = 'C'
      } else if (this.roleInfo.preferreddamage === 'slashingweapons') {
        this.damageType = 'S'
      } else {
        scalingStrength = null
        this.damageType = ''
      }
    }

    const scaling = this.combatStatsService.getDamageScalingInfo(this.damageType);

    let modifiedPoints = this.combatStatsService.getModifiedStat(scalingStrength, scaling, this.points)

    if (modifiedPoints <= 0) {
      modifiedPoints = 1
    }

    let crushingDamageMod = 0
    let diceObject = {
      d3s: 0,
      d4s: 0,
      d6s: 0,
      d8s: 0,
      d10s: 0,
      d12s: 0,
      d20s: 0,
    }

    if (this.damageType === 'S') {
      diceObject.d4s += Math.floor(modifiedPoints / 2)
      let leftover = modifiedPoints % 2
      if (leftover === 1) {
        diceObject.d3s += 1
      }
    } else if (this.damageType === 'P') {
      diceObject.d8s += Math.floor(modifiedPoints / 4)
      let leftover = modifiedPoints % 4
      if (leftover === 1) {
        diceObject.d3s += 1
      } else if (leftover === 2) {
        diceObject.d4s += 1
      } else if (leftover === 3) {
        diceObject.d6s += 1
      }
    } else {
      if (modifiedPoints === 1) {
        diceObject.d4s += 1
      } else if (modifiedPoints === 2) {
        diceObject.d6s += 1
      } else if (modifiedPoints === 3) {
        diceObject.d8s += 1
      } else if (modifiedPoints === 4) {
        diceObject.d10s += 1
      } else if (modifiedPoints === 5) {
        diceObject.d12s += 1
      } else if (modifiedPoints === 6) {
        diceObject.d20s += 1
      } else {
        diceObject.d20s += 1
        crushingDamageMod = modifiedPoints - 6
      }
    }

    let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

    let diceString = ''
    let baseRecovery = 0

    if (d3s > 0) {
      diceString += `${d3s}d3!`
      baseRecovery += d3s * this.combatStatsService.getRecoveryFromDiceSize('d3')
    }
    if (d4s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
      baseRecovery += d4s * this.combatStatsService.getRecoveryFromDiceSize('d4')
    }
    if (d6s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
      baseRecovery += d6s * this.combatStatsService.getRecoveryFromDiceSize('d6')
    }
    if (d8s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
      baseRecovery += d8s * this.combatStatsService.getRecoveryFromDiceSize('d8')
    }
    if (d10s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
      baseRecovery += d10s * this.combatStatsService.getRecoveryFromDiceSize('d10')
    }
    if (d12s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
      baseRecovery += d12s * this.combatStatsService.getRecoveryFromDiceSize('d12')
    }
    if (d20s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
      baseRecovery += d20s * this.combatStatsService.getRecoveryFromDiceSize('d20')
    }

    if (crushingDamageMod) {
      diceString += ` +${crushingDamageMod}`
    }

    this.baseRecovery = baseRecovery
    this.setModifiedRecovery()

    if (this.combatStats.isspecial === 'kinda') {
      diceString += '*'
    }

    this.damageString = diceString
  }

  setModifiedRecovery = () => {
    let scalingStrength;

    if (this.combatStats.recovery) {
      scalingStrength = this.combatStats.recovery
    } else {
      scalingStrength = this.roleInfo.recovery
    }

    const scaling = this.combatStatsService.getStatScaling('recovery')

    if (scalingStrength === 'noneWk') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.majWk)
    } else if (scalingStrength === 'none') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.none)
    } else {
      this.recovery = Math.ceil((scaling.scaling[scalingStrength] * this.baseRecovery) - (scaling.bonus[scalingStrength] * this.points))
    }
  }

  getCover = () => {
    const cover = this.combatStatsService.getModifiedStatsMinZero('rangeddefense', this.combatStats, this.roleInfo, this.points)
    if (cover > 0) {
      const crouchedCover = cover * 1.5

      if (crouchedCover >= 20) {
        return `+${Math.floor(cover)}(*)`
      } else {
        return `+${Math.floor(cover)}(+${Math.floor(crouchedCover)})`
      }
    } else {
      return '+0'
    }
  }

  getBaseDR = () => {
    if (this.equipmentLists.armor.length > 0 && this.combatStats.armor) {
      const armorSlash = this.combatStatsService.getArmorOrShieldStat('weaponsmallslashing', 'armor', 'slash', this.combatStats, this.roleInfo, this.equipmentObjects, this.points)
      const armorStatic = this.combatStatsService.getArmorOrShieldStat('weaponsmallcrushing', 'armor', 'flat', this.combatStats, this.roleInfo, this.equipmentObjects, this.points)

      return this.getDRString(armorSlash, armorStatic)
    }
    const slashDR = this.combatStatsService.getModifiedStatsRounded('weaponsmallslashing', this.combatStats, this.roleInfo, this.points)
    const staticDR = this.combatStatsService.getModifiedStatsRounded('weaponsmallcrushing', this.combatStats, this.roleInfo, this.points)

    return this.getDRString(slashDR, staticDR)
  }

  getParryDR = () => {
    if (this.equipmentLists.shields.length > 0 && this.combatStats.shield) {
      const shieldSlash = this.combatStatsService.getArmorOrShieldStat('andslashing', 'shield', 'slash', this.combatStats, this.roleInfo, this.equipmentObjects, this.points)
      const shieldStatic = this.combatStatsService.getArmorOrShieldStat('andcrushing', 'shield', 'flat', this.combatStats, this.roleInfo, this.equipmentObjects, this.points)

      return this.getDRString(shieldSlash, shieldStatic)
    }

    const slashDR = this.combatStatsService.getModifiedStatsRounded('andslashing', this.combatStats, this.roleInfo, this.points)
    const staticDR = this.combatStatsService.getModifiedStatsRounded('andcrushing', this.combatStats, this.roleInfo, this.points)

    return this.getDRString(slashDR, staticDR)
  }

  getDRString = (slashDR, staticDR) => {
    if (slashDR > 0 && staticDR > 0) {
      return `${slashDR}/d +${staticDR}`
    } else if (slashDR > 0) {
      return `${slashDR}/d`
    } else if (staticDR > 0) {
      return `${staticDR}`
    } else {
      return 0
    }
  }

  getWeaponType = () => {
    if (this.combatStats.weapon) {
      return this.weaponType = this.equipmentObjects.weapons[this.combatStats.weapon].range ? 'r' : 'm'
    }
    if (this.combatStats.weapontype) {
      return this.combatStats.weapontype
    }
    return this.weaponType
  }

const scalingAndBases = {
    piercingweapons: {
        scaling: {
            majSt: 6,
            minSt: 5,
            none: 4,
            minWk: 3,
            majWk: 2
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    slashingweapons: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    crushingweapons: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weapon: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    all: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: -2,
            majWk: -4
        },
        bonus: {
            majSt: 1.1,
            minSt: 1.05,
            none: 0,
            minWk: 1,
            majWk: .9
        }
    },
    largeweapons: {
        scaling: {
            majSt: 50,
            minSt: 35,
            none: 25,
            minWk: 20,
            majWk: 15
        },
        bonus: {
            majSt: 15,
            minSt: 10,
            none: 0,
            minWk: 5,
            majWk: 1
        }
    },
    rangeddefense: {
        scaling: {
            majSt: 6,
            minSt: 3,
            none: 0,
            minWk: -3,
            majWk: -6
        },
        bonus: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: 1,
            majWk: .75
        }
    },
    weaponsmallcrushing: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: -1,
            majWk: -3
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weaponsmallpiercing: {
        scaling: {
            majSt: 6,
            minSt: 3,
            none: 0,
            minWk: -3,
            majWk: -6
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    andslashing: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 1,
            minWk: 0,
            majWk: -1
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    andcrushing: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weaponsmallslashing: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -2,
            majWk: -4
        },
        bonus: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    flanks: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 1.5,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    attack: {
        scaling: {
            majSt: 5,
            minSt: 3,
            none: 0,
            minWk: -3,
            majWk: -5
        },
        bonus: {
            majSt: 1.25,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .33
        }
    },
    caution: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    fatigue: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    initiative: {
        scaling: {
            majSt: -2,
            minSt: -1,
            none: 0,
            minWk: 2,
            majWk: 4
        },
        bonus: {
            majSt: 1.5,
            minSt: 1.25,
            none: 0,
            minWk: .75,
            majWk: .5
        }
    },
    measure: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 1.1,
            minSt: 1,
            none: 0,
            minWk: .75,
            majWk: .21
        }
    },
    panic: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    rangedistance: {
        scaling: {
            majSt: 200,
            minSt: 100,
            none: 50,
            minWk: 25,
            majWk: 10
        },
        bonus: {
            majSt: 50,
            minSt: 20,
            none: 0,
            minWk: 5,
            majWk: 2
        }
    },
    recovery: {
        base: {
            d3: 2,
            d4: 3,
            d6: 4,
            d8: 5,
            d10: 6,
            d12: 7,
            d20: 11,
        },
        scaling: {
            majSt: .75,
            minSt: .9,
            none: 1,
            minWk: 1.1,
            majWk: 1.25
        },
        bonus: {
            majSt: .5,
            minSt: .25,
            none: 0,
            minWk: .1,
            majWk: .05
        }
    },
    movement: {
        scaling: {
            majSt: 7.5,
            minSt: 5,
            none: 2.5,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: .5,
            minSt: .3,
            none: 0,
            minWk: .2,
            majWk: .1
        }
    },
    mental: {
        scaling: {
            majSt: 50,
            minSt: 35,
            none: 25,
            minWk: 20,
            majWk: 15
        },
        bonus: {
            majSt: 15,
            minSt: 10,
            none: 0,
            minWk: 5,
            majWk: 1
        }
    }
}

module.exports = combatSquareController