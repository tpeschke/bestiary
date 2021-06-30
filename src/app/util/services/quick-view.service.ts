import { Injectable } from '@angular/core';
import { BeastService } from './beast.service';

@Injectable({
  providedIn: 'root'
})
export class QuickViewService {

  constructor(
    private beastService: BeastService
  ) { }

  public quickViewArray: any = [{
    "id": 244,
    "name": "Animated Corpse, Large",
    "sp_atk": "<p>None.</p>",
    "sp_def": "<p>Animated corpses are unable to go faster than a Jog.</p>",
    "vitality": "d8! + 30",
    "panic": 7,
    "hash": "1Ka6urEMgT",
    "stress": 0,
    "patreon": 0,
    "movement": [
        {
            "id": 279,
            "beastid": 244,
            "stroll": "5 ft / sec",
            "walk": "7.5 ft / sec",
            "jog": "15 ft / sec",
            "run": "0",
            "sprint": "0",
            "type": "Land"
        }
    ],
    "combat": [
        {
            "id": 320,
            "beastid": 244,
            "spd": 16,
            "atk": 0,
            "init": 10,
            "def": "-7",
            "shield_dr": null,
            "measure": 5.5,
            "damage": "2d12!+6",
            "parry": 0,
            "encumb": 0,
            "dr": "4",
            "weapon": "Maul",
            "weapontype": "m"
        },
        {
            "id": 321,
            "beastid": 244,
            "spd": 10,
            "atk": 0,
            "init": 10,
            "def": "-1",
            "shield_dr": null,
            "measure": 0,
            "damage": "d6!+6",
            "parry": 0,
            "encumb": 0,
            "dr": "4",
            "weapon": "Unarmed",
            "weapontype": "m"
        }
    ]
}];

  addToQuickViewArray (beastid) {
    this.beastService.getQuickView(beastid).subscribe(results => {
      this.quickViewArray.push(results)
      this.beastService.handleMessage({message: `${results.name} have been added to your quick view`, color: "green"})
    })
  }
}
