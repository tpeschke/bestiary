import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service.js';
import roles from '../../roles.js'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['../../beast-view.component.css', './combat-info.component.css']
})
export class CombatInfoComponent implements OnChanges {
  @Input() primaryRole: any;
  @Input() secondaryRole: any;
  @Input() combatStats: any;
  @Input() points: any;
  @Input() physical: any;
  @Input() physicalCallback: Function
  @Input() size: any = "Medium";

  weaponControl: any;
  weaponGroupOptions: Observable<any[]>;

  armorControl: any;
  armorGroupOptions: Observable<any[]>;

  shieldControl: any;
  shieldGroupOptions: Observable<any[]>;

  constructor(
    public beastService: BeastService
  ) { }

  public combatSquare = null

  public roleInfo = null;
  public damageType = ''
  public damageString = ''
  public baseRecovery = 0
  public recovery = 0
  public vitality = 0
  public stressThreshold = 0
  public panic = 0
  public weaponType = ''

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }
  public showAllEquipment = false
  public controllerWeapons = roles.combatRoles.secondary.Controller.weapons
  public primaryRoles = roles.combatRoles.primary

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
      label: 'Ranged Defenses',
      stat: 'rangeddefense',
      tooltip: 'Cover'
    },
    {
      label: 'Weapons, Small, Crushing',
      stat: 'weaponsmallcrushing',
      tooltip: 'DR'
    },
  ]
  public defenseStatsPartTwo = [
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
      label: 'Initiative',
      stat: 'initiative'
    }
  ]

  ngOnInit() {
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
      this.bootUpAutoComplete()
    })

    this.checkShowAllEquipment()
  }

  bootUpAutoComplete (){
    this.weaponControl = new FormControl(this.equipmentLists.weapons);
    this.weaponGroupOptions = this.weaponControl.valueChanges
    .pipe(
      startWith(''),
      map((value: string) => {
        let weaponList = this.primaryRole  && !this.showAllEquipment ? this.primaryRoles[this.primaryRole].weapons : this.equipmentLists.weapons
        if (this.secondaryRole === 'Controller' && !this.showAllEquipment) {
          weaponList = [...this.controllerWeapons, ...weaponList]
        }
        return this._filterGroup(value, weaponList)
      })
    );
    this.armorControl = new FormControl(this.equipmentLists.weapons);
    this.armorGroupOptions = this.armorControl.valueChanges
    .pipe(
      startWith(this.combatStats.armor || ''),
      map((value: string) => {
        if (this.primaryRole && !this.showAllEquipment) {
          return [{label: 'Preferred Armor', items: this._filter(this.primaryRoles[this.primaryRole].armor || [], value)}]
        } else {
          return this._filterGroup(value, this.equipmentLists.armor)
        }
      })
    );
    this.shieldControl = new FormControl(this.equipmentLists.weapons);
    this.shieldGroupOptions = this.shieldControl.valueChanges
    .pipe(
      startWith(this.combatStats.shield || ''),
      map((value: string) => {
        if (this.primaryRole && !this.showAllEquipment) {
          return [{label: 'Preferred Shields', items: this._filter(this.primaryRoles[this.primaryRole].shields || [], value)}]
        } else {
          return this._filterGroup(value, this.equipmentLists.shields)
        }
      })
    );
  }

  private _filterGroup(value: string, groups: any): any[] {
    if (value) {
      return groups
        .map(group => ({label: group.label, items: this._filter(group.items || [], value)}))
        .filter(group => group.items.length > 0);
    }
    return groups;
  }

  _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
    return opt.filter(item => item.toLowerCase().includes(filterValue));
  };

  getDisplayTextWeapon = (option) => {
    return this.getDisplayText(option, 'weapon')
  }

  getDisplayTextArmor = (option) => {
    return this.getDisplayText(option, 'armor')
  }

  getDisplayTextShield = (option) => {
    return this.getDisplayText(option, 'shield')
  }

  getDisplayText = (option, type) => {
    if (option && option.item) {
      return option.item
    } else if (type) {
      return this.combatStats[type]
    }
    return ''
  }

  ngOnChanges(changes) {
    this.setRoleInfo()
    this.getCombatSquare()
    this.bootUpAutoComplete()
  }
  
  checkShowAllEquipment = () => {
    if (this.primaryRole) {
      let armorOnRoleList = false
      let shieldOnRoleList = false
      let weaponOnRoleList = false
      if (this.combatStats.weapon) {
        this.primaryRoles[this.primaryRole].weapon.forEach(weaponCat => {
          weaponCat.forEach(weaponToCheck => {
            if (weaponToCheck === this.combatStats.weapon) {
              weaponOnRoleList = true
            }
          })
        })
      }
      if (this.combatStats.armor) {
        this.primaryRoles[this.primaryRole].armor.forEach(armorToCheck => {
          if (armorToCheck === this.combatStats.armor) {
            armorOnRoleList = true
          }
        })
      }
      if (this.combatStats.shield) {
        this.primaryRoles[this.primaryRole].shield.forEach(shieldToCheck => {
          if (shieldToCheck === this.combatStats.shield) {
            shieldOnRoleList = true
          }
        })
      }

      this.showAllEquipment = (this.combatStats.armor && !armorOnRoleList) || (this.combatStats.shield && !shieldOnRoleList) || (this.combatStats.weapon && !weaponOnRoleList) 
    }
  }

  getCombatSquare() {
    this.beastService.getCombatSquare(this.combatStats, this.primaryRole, this.points, this.size).subscribe(res => {
      this.combatSquare = res
    })
  }

  setRoleInfo = () => {
    if (this.primaryRole) {
      this.weaponType = roles.combatRoles.primary[this.primaryRole].weapontype
      if (this.combatStats.weapontype) {
        if (this.combatStats.weapontype === 'm') {
          this.roleInfo = roles.combatRoles.primary[this.primaryRole].meleeCombatStats
        } else if (this.combatStats.weapontype === 'r') {
          this.roleInfo = roles.combatRoles.primary[this.primaryRole].rangedCombatStats
        }
      } else {
        if (roles.combatRoles.primary[this.primaryRole].weapontype === 'm') {
          this.roleInfo = roles.combatRoles.primary[this.primaryRole].meleeCombatStats
        } else if (roles.combatRoles.primary[this.primaryRole].weapontype === 'r') {
          this.roleInfo = roles.combatRoles.primary[this.primaryRole].rangedCombatStats
        }
      }
    }
  }

  checkWeaponStat = (value, event) => {
    if (this.combatStats.piercingweapons) {
      this.checkAttackStat('piercingweapons', value, event)
    } else if (this.combatStats.crushingweapons) {
      this.checkAttackStat('crushingweapons', value, event)
    } else if (this.combatStats.slashingweapons) {
      this.checkAttackStat('slashingweapons', value, event)
    } else {
      this.checkAttackStat(this.roleInfo.preferreddamage, value, event)
    }
    
    this.getCombatSquare()
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
    
    this.getCombatSquare()
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

    this.getCombatSquare()
  }

  checkPhysicalStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }

    if (this.physical[stat] === value) {
      event.source._checked = false
      this.physical[stat] = null
    } else if (this.roleInfo[stat] === value || (value === 'none' && !this.roleInfo[stat])) {
      event.source._checked = true
      this.physical[stat] = null
    } else {
      this.physical[stat] = value
    }

    this.physicalCallback()
    this.getCombatSquare()
  }

  checkBasicStat = (stat, value, event) => {
    if (this.combatStats[stat] === value) {
      event.source._checked = false
      this.combatStats[stat] = null
    } else {
      this.combatStats[stat] = value
    }

    this.getCombatSquare()
  }

  checkComponentVariable = (stat, event) => {
    this[stat] = event.checked

    if (stat === 'showAllEquipment') {
      this.bootUpAutoComplete()
    }
  }

  checkBasicStatOnOff = (stat, event) => {
    this.combatStats[stat] = event.checked
    
    this.getCombatSquare()
  }

  captureSelected = (event, type) => {
    if (event.option.value) {
      this.combatStats[type] = event.option.value
    } else {
      this.combatStats[type] = null
    }

    this.getCombatSquare()

    if (type === 'armor' || type === 'shield') {
      this.physicalCallback()
    }
  }

  captureInput = (event, type) => {
    this.combatStats[type] = event.target.value
  }
}
