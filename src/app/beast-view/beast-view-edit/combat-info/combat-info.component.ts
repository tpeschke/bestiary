import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['./combat-info.component.css']
})
export class CombatInfoComponent implements OnInit {
  public points = 0
  public combatstats = {
    weaponSmallSlashing: null,
    weaponSmallCrushing: null,
    weaponSmallPiercing: null,
    andSlashing: null,
    andCrushing: null,
    flanks: null,
    rangedDefense: null,
    all: null
  }

  constructor() { }

  ngOnInit() {
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
