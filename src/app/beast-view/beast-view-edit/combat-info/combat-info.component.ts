import { Component, OnInit } from '@angular/core';
import roles from '../../roles.js'

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['./combat-info.component.css']
})
export class CombatInfoComponent implements OnInit {
  public points = 0
  public primaryRole = 'Artillery'
  public combatStats = {
    piercingweapons: null,
    slashingweapons: null,
    crushingweapons: null,
    weaponsmallslashing: null,
    weaponssmalcrushing: null,
    weaponssmallpiercing: null,
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
      stat: 'rangeddefence',
      tooltip: 'Cover'
    },
    {
      label: 'Weapons, Small, Piercing',
      stat: 'weaponssmallpiercing',
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
      label: 'Weapons, Small, Crushing',
      stat: 'weaponssmalcrushing',
      tooltip: 'DR'
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

  ngOnInit() {
    if (this.primaryRole) {
      this.roleInfo = roles.combatRoles.primary[this.primaryRole].combatStats
    }
  }

  checkAttackStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }
    if (this.combatStats[stat] === value) {
      event.source._checked = false
      this.combatStats[stat] = null
    } else if (this.roleInfo.damage === value || (value === 'none' && !this.roleInfo.damage)) {
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
  }

  public scalingAndBases = {
    weaponSmallSlashing: {
      scaling: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: -2,
        majorWk: -4
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    weaponSmallCrushing: {
      scaling: {
        majSt: 3,
        minSt: 2,
        none: 0,
        minWk: -1,
        majorWk: -3
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    weaponSmallPiercing: {
      scaling: {
        majSt: 6,
        minSt: 3,
        none: 0,
        minWk: -3,
        majorWk: -6
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    andSlashing: {
      scaling: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: -1,
        majorWk: -2
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 1,
        minWk: .5,
        majorWk: .25
      }
    },
    andCrushing: {
      scaling: {
        majSt: 3,
        minSt: 2,
        none: 0,
        minWk: -1,
        majorWk: -2
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    flanks: {
      scaling: {
        majSt: 3,
        minSt: 2,
        none: 1,
        minWk: -1,
        majorWk: -2
      },
      bonus: {
        majSt: .5,
        minSt: .25,
        none: .1,
        minWk: .05,
        majorWk: .01
      }
    },
    rangedDefense: {
      scaling: {
        majSt: 6,
        minSt: 3,
        none: 0,
        minWk: -3,
        majorWk: -6
      },
      bonus: {
        majSt: 3,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    all: {
      scaling: {
        majSt: 3,
        minSt: 2,
        none: 0,
        minWk: -2,
        majorWk: -4
      },
      bonus: {
        majSt: 1.25,
        minSt: 1.1,
        none: 0,
        minWk: 1,
        majorWk: .75
      }
    }
  }

}
