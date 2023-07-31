import { Component, OnInit, Input, OnChanges } from '@angular/core';
import roles from '../../roles.js'

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['../../beast-view.component.css', './combat-info.component.css']
})
export class CombatInfoComponent implements OnChanges {
  @Input() primaryRole: any;

  public points = 0
  public combatStats = {
    piercingweapons: null,
    slashingweapons: null,
    crushingweapons: null,
    weaponsmallslashing: null,
    weaponsmalcrushing: null,
    weaponsmallpiercing: null,
    andslashing: null,
    andcrushing: null,
    flanks: null,
    rangeddefence: null,
    all: null,
    allaround: null,
    armorandshields: null,
    unarmored: null,
    attack: null,
    caution: null,
    fatigue: null,
    initiative: null,
    measure: null,
    panic: null,
    rangedistance: null,
    recovery: null,
    largeweapons: null
  }

  constructor() { }

  public roleInfo = null;
  public damageType = ''
  public damageString = ''
  public baseRecovery = 0
  public recovery = 0

  public attackStats = [
    {
      label: 'All Around',
      stat: 'piercingweapons',
      tooltip: 'Piercing'
    },
    {
      label: 'Armor & Shields',
      stat: 'crushingweapons',
      tooltip: 'Crushing'
    },
    {
      label: 'Unarmored',
      stat: 'slashingweapons',
      tooltip: 'Slashing'
    },
  ]
  public defenseStats = [
    {
      label: 'All',
      stat: 'all',
      tooltip: 'Defense'
    },
    {
      label: 'Large Weapons',
      stat: 'largeweapons',
      tooltip: 'Vitality'
    },
    {
      label: 'Ranged Defenses',
      stat: 'rangeddefense',
      tooltip: 'Cover'
    },
    {
      label: 'Weapons, Small, Crushing',
      stat: 'weaponsmallcrushing',
      tooltip: 'DR'
    },
    {
      label: 'Weapons, Small, Piercing',
      stat: 'weaponsmallpiercing',
      tooltip: 'Parry'
    },
    {
      label: '& Slashing',
      stat: 'andslashing',
      tooltip: 'Parry /DR'
    },
    {
      label: '& Crushing',
      stat: 'andcrushing',
      tooltip: 'Parry DR'
    },
    {
      label: 'Flanks',
      stat: 'flanks',
      tooltip: null
    },
    {
      label: 'Weapons, Small, Slashing',
      stat: 'weaponsmallslashing',
      tooltip: '/DR'
    }
  ]
  public otherStats = [
    {
      label: 'Attack',
      stat: 'attack'
    },
    {
      label: 'Caution',
      stat: 'caution'
    },
    {
      label: 'Fatigue',
      stat: 'fatigue'
    },
    {
      label: 'Initiative',
      stat: 'initiative'
    },
    {
      label: 'Measure',
      stat: 'measure'
    },
    {
      label: 'Panic',
      stat: 'panic'
    },
    {
      label: 'Range, Distance',
      stat: 'rangedistance'
    },
    {
      label: 'Recovery',
      stat: 'recovery'
    }
  ]

  ngOnChanges(changes) {
    if (this.primaryRole) {
      this.roleInfo = roles.combatRoles.primary[this.primaryRole].combatStats
    }
    this.setDamageDice()
  }

  getDamageScalingInfo = () => {
    if (this.damageType === 'C') {
      return this.scalingAndBases.crushingweapons
    } else if (this.damageType === 'P') {
      return this.scalingAndBases.piercingweapons
    } else if (this.damageType === 'S') {
      return this.scalingAndBases.slashingweapons
    } 
  }

  setDamageDice() {
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

    const scaling = this.getDamageScalingInfo();

    let modifiedPoints
    if (scalingStrength === 'noneWk') {
      modifiedPoints = scaling.scaling.majWk
    } else if (scalingStrength === 'none') {
      modifiedPoints = scaling.scaling.none
    } else {
      modifiedPoints = scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * this.points)
    }

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
      diceObject.d20s += Math.floor(modifiedPoints / 7)
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
      baseRecovery += d3s * this.scalingAndBases.recovery.base.d3
    }
    if (d4s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
      baseRecovery += d4s * this.scalingAndBases.recovery.base.d4
    }
    if (d6s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
      baseRecovery += d6s * this.scalingAndBases.recovery.base.d6
    }
    if (d8s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
      baseRecovery += d8s * this.scalingAndBases.recovery.base.d8
    }
    if (d10s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
      baseRecovery += d10s * this.scalingAndBases.recovery.base.d10
    }
    if (d12s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
      baseRecovery += d12s * this.scalingAndBases.recovery.base.d12
    }
    if (d20s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
      baseRecovery += d20s * this.scalingAndBases.recovery.base.d20
    }

    if (crushingDamageMod) {
      diceString += ` +${crushingDamageMod}`
    }

    this.baseRecovery = baseRecovery
    this.setModifiedRecovery()

    this.damageString = diceString
  }

  setModifiedRecovery = () => {
    let scalingStrength;

    if (this.combatStats.recovery) {
      scalingStrength = this.combatStats.recovery
    } else {
      scalingStrength = this.roleInfo.recovery
    }

    const scaling = this.scalingAndBases.recovery

    if (scalingStrength === 'noneWk') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.majWk)
    } else if (scalingStrength === 'none') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.none)
    } else {
      this.recovery =  Math.ceil((scaling.scaling[scalingStrength] * this.baseRecovery) - (scaling.bonus[scalingStrength] * this.points))
    }
  }

  getModifiedStats = (stat) => {
    let scalingStrength;
    let modifiedStat;

    if (this.combatStats[stat]) {
      scalingStrength = this.combatStats[stat]
    } else {
      scalingStrength = this.roleInfo[stat]
    }

    const scaling = this.scalingAndBases[stat]

    if (scalingStrength === 'noneWk') {
      modifiedStat = scaling.scaling.majWk
    } else if (scalingStrength === 'none') {
      modifiedStat = scaling.scaling.none
    } else {
      modifiedStat =  Math.ceil(scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * this.points))
    }

    return modifiedStat
  }

  getCover = () => {
    const cover = this.getModifiedStats('rangeddefense')
    const crouchedCover = cover * 1.5

    if (crouchedCover >= 20) {
      return `+${cover}(*)`
    } else {
      return `+${cover}(+${crouchedCover})`
    }
  }

  getBaseDR = () => {
    const slashDR = this.getModifiedStats('weaponsmallslashing')
    const staticDR = this.getModifiedStats('weaponsmallcrushing')

    return this.getDR(slashDR, staticDR)
  }

  getParryDR = () => {
    const slashDR = this.getModifiedStats('andslashing')
    const staticDR = this.getModifiedStats('andcrushing')

    return this.getDR(slashDR, staticDR)
  }

  getDR = (slashDR, staticDR) => {
    if (slashDR > 0 && staticDR > 0) {
      return `${slashDR}/d +${staticDR}`
    } else if (slashDR > 0) {
      return `${slashDR}/d`
    } else if (staticDR > 0) {
      return `${staticDR}`
    } else {
      return ''
    }
  }

  checkAttackStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }
    if (this.combatStats[stat] === value) {
      event.source._checked = false
      this.combatStats[stat] = null
    } else if ((this.roleInfo.damage === value && this.roleInfo.preferreddamage === stat) || (value === 'none' && !this.roleInfo.damage)) {
      event.source._checked = true
      this.combatStats[stat] = null
    } else {
      this.combatStats[stat] = value
    }

    if (stat === 'piercingweapons') {
      this.combatStats.slashingweapons = null
      this.combatStats.crushingweapons = null
    } else if (stat === 'slashingweapons') {
      this.combatStats.piercingweapons = null
      this.combatStats.crushingweapons = null
    } else if (stat === 'crushingweapons') {
      this.combatStats.slashingweapons = null
      this.combatStats.piercingweapons = null
    }

    this.setDamageDice()
  }

  checkOtherStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }
    if (this.combatStats[stat] === value) {
      event.source._checked = false
      this.combatStats[stat] = null
    } else if (this.roleInfo[stat] === value || (value === 'none' && !this.roleInfo[stat])) {
      event.source._checked = true
      this.combatStats[stat] = null
    } else {
      this.combatStats[stat] = value
    }

    if (stat === 'recovery') {
      this.setModifiedRecovery()
    }
  }

  public scalingAndBases = {
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
        majSt: 25,
        minSt: 10,
        none: 0,
        minWk: -10,
        majWk: -25
      },
      bonus: {
        majSt: 15,
        minSt: 10,
        none: 0,
        minWk: 5,
        majWk: 1
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
        minWk: 1,
        majWk: .5
      },
      bonus: {
        majSt: 5,
        minSt: 2.5,
        none: 0,
        minWk: 1,
        majWk: .5
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

}
