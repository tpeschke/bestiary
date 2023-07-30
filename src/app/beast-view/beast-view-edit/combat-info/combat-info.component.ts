import { Component, OnInit, Input, OnChanges } from '@angular/core';
import roles from '../../roles.js'

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['./combat-info.component.css']
})
export class CombatInfoComponent implements OnChanges {
  @Input() primaryRole: any;

  public points = 0

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
    piercingweapons: {
      scaling: {
        majSt: 6,
        minSt: 5,
        none: 4,
        minWk: 3,
        majorWk: 2
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    slashingweapons: {
      scaling: {
        majSt: 5,
        minSt: 4,
        none: 3,
        minWk: 2,
        majorWk: 1
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    crushingweapons: {
      scaling: {
        majSt: 5,
        minSt: 4,
        none: 3,
        minWk: 2,
        majorWk: 1
      },
      bonus: {
        majSt: 2,
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
        majSt: 1.1,
        minSt: 1.05,
        none: 0,
        minWk: 1,
        majorWk: .9
      }
    },
    largeweapons: {
      scaling: {
        majSt: 50,
        minSt: 35,
        none: 25,
        minWk: 20,
        majorWk: 15
      },
      bonus: {
        majSt: 15,
        minSt: 10,
        none: 0,
        minWk: 5,
        majorWk: 1
      }
    },
    rangeddefense: {
      scaling: {
        majSt: 6,
        minSt: 3,
        none: 0,
        minWk: -3,
        majorWk: -6
      },
      bonus: {
        majSt: 3,
        minSt: 2,
        none: 0,
        minWk: 1,
        majorWk: .75
      }
    },
    weaponsmallcrushing: {
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
    weaponsmallpiercing: {
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
    andslashing: {
      scaling: {
        majSt: 3,
        minSt: 2,
        none: 1,
        minWk: 0,
        majorWk: -1
      },
      bonus: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    andcrushing: {
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
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    weaponsmallslashing: {
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
    flanks: {
      scaling: {
        majSt: 2,
        minSt: 1,
        none: 0,
        minWk: -1,
        majorWk: -2
      },
      bonus: {
        majSt: 1.5,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .25
      }
    },
    attack: {
      scaling: {
        majSt: 5,
        minSt: 3,
        none: 0,
        minWk: -3,
        majorWk: -5
      },
      bonus: {
        majSt: 1.25,
        minSt: 1,
        none: 0,
        minWk: .5,
        majorWk: .33
      }
    },
    caution: {
      scaling: {
        majSt: .5,
        minSt: .35,
        none: .25,
        minWk: .1,
        majorWk: 0
      },
      bonus: {
        majSt: .15,
        minSt: .1,
        none: 0,
        minWk: .05,
        majorWk: .01
      }
    },
    fatigue: {
      scaling: {
        majSt: .5,
        minSt: .35,
        none: .25,
        minWk: .1,
        majorWk: 0
      },
      bonus: {
        majSt: .15,
        minSt: .1,
        none: 0,
        minWk: .05,
        majorWk: .01
      }
    },
    initiative: {
      scaling: {
        majSt: -2,
        minSt: -1,
        none: 0,
        minWk: 2,
        majorWk: 4
      },
      bonus: {
        majSt: 1.5,
        minSt: 1.25,
        none: 0,
        minWk: .75,
        majorWk: .5
      }
    },
    measure: {
      scaling: {
        majSt: 5,
        minSt: 4,
        none: 3,
        minWk: 2,
        majorWk: 1
      },
      bonus: {
        majSt: 1.1,
        minSt: 1,
        none: 0,
        minWk: .75,
        majorWk: .21
      }
    },
    panic: {
      scaling: {
        majSt: .5,
        minSt: .35,
        none: .25,
        minWk: .1,
        majorWk: 0
      },
      bonus: {
        majSt: .15,
        minSt: .1,
        none: 0,
        minWk: .05,
        majorWk: .01
      }
    },
    rangedistance: {
      scaling: {
        majSt: 25,
        minSt: 10,
        none: 0,
        minWk: -10,
        majorWk: -25
      },
      bonus: {
        majSt: 15,
        minSt: 10,
        none: 0,
        minWk: 5,
        majorWk: 1
      }
    },
    recovery: {
      scaling: {
        d3: 2,
        d4: 3,
        d6: 4,
        d8: 5
      },
      bonus: {
        majSt: 2,
        minSt: 1.5,
        none: 0,
        minWk: 1,
        majorWk: .5
      }
    },
    movement: {
      scaling: {
        majSt: 7.5,
        minSt: 5,
        none: 2.5,
        minWk: 1,
        majorWk: .5
      },
      bonus: {
        majSt: 5,
        minSt: 2.5,
        none: 0,
        minWk: 1,
        majorWk: .5
      }
    },
    mental: {
      scaling: {
        majSt: 50,
        minSt: 35,
        none: 25,
        minWk: 20,
        majorWk: 15
      },
      bonus: {
        majSt: 15,
        minSt: 10,
        none: 0,
        minWk: 5,
        majorWk: 1
      }
    }
}

}
