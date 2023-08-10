import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombatStatsService {

constructor() { }

getStatScaling = function (stat) {
  return this.scalingAndBases[stat]
}

getModifiedStats = function (stat, combatStats, roleInfo, points)  {
  let scalingStrength;

  if (combatStats[stat]) {
    scalingStrength = combatStats[stat]
  } else {
    scalingStrength = roleInfo[stat]
  }

  const scaling = this.scalingAndBases[stat]
  const modifiedStat = this.getModifiedStat(scalingStrength, scaling, points)

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

  const scaling = this.scalingAndBases[combatStatKey]

  if (combatStats.weapon) {
    const weaponStat = equipmentObjects.weapons[combatStats.weapon][weaponKey]
    if (scalingStrength === 'noneWk') {
      modifiedStat = weaponStat - (scaling.none - scaling.majWk)
    } else if (scalingStrength === 'none' || !scalingStrength) {
      modifiedStat = weaponStat
    } else {
      modifiedStat = weaponStat + (scaling.bonus[scalingStrength] * points)
    }
  } else {
    modifiedStat = this.getModifiedStat(scalingStrength, scaling, points)
  }

  if (modifiedStat > 0) {
    return Math.floor(modifiedStat)
  }
  return 0
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

  const scaling = this.scalingAndBases.movement
  const modifiedStat = this.getModifiedStat(scalingStrength, scaling, points)

  return modifiedStat
}

getModifiedStatsRounded = function (stat, combatStats, roleInfo, points)  {
  return Math.floor(this.getModifiedStats(stat, combatStats, roleInfo, points))
}

getModifiedStatsMinZero = function (stat, combatStats, roleInfo, points)  {
  const modifiedStat = this.getModifiedStats(stat, combatStats, roleInfo, points)
  if (modifiedStat > 0) {
    return modifiedStat
  }
  return 0
}

getDamageScalingInfo = function (damageType)  {
  if (damageType === 'C') {
    return this.scalingAndBases.crushingweapons
  } else if (damageType === 'P') {
    return this.scalingAndBases.piercingweapons
  } else if (damageType === 'S') {
    return this.scalingAndBases.slashingweapons
  }
}

getRecoveryFromDiceSize = function (diceSize)  {
  return this.scalingAndBases.recovery.base[diceSize]
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
}
