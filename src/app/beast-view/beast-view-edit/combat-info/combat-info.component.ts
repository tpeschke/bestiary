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
    weaponSmallSlashing: null,
    weaponSmallCrushing: null,
    weaponSmallPiercing: null,
    andSlashing: null,
    andCrushing: null,
    flanks: null,
    rangedDefense: null,
    all: null,
    allAround: null,
    armorAndShields: null,
    unarmored: null,
    attack: null,
    caution: null,
    fatigue: null,
    initiative: null,
    measure: null,
    panic: null,
    rangeDistance: null,
    recovery: null
  }

  constructor() { }

  public roleInfo = null;

  ngOnInit() {
    if (this.primaryRole) {
      this.roleInfo = roles.combatRoles.primary[this.primaryRole].combatStats
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
