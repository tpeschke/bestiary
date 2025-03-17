import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service.js';
import roles from '../../../../roles.js'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-single-attack-display',
  templateUrl: './single-attack-display.component.html',
  styleUrls: ['../../../../beast-view.component.css', './../../../combat-info/combat-info.component.css', './single-attack-display.component.css']
})
export class SingleAttackDisplayComponent implements OnInit {
  @Input() primaryRole: any;
  @Input() secondaryRole: any;
  @Input() combatStats: any;
  @Input() points: any;
  @Input() physical: any;
  @Input() removeCallback: Function
  @Input() index: any
  @Input() size: any = "Medium";
  @Input() setAttackInfo: Function;
  @Input() defaultname: any;

  weaponControl: any;
  weaponGroupOptions: Observable<any[]>;

  constructor(
    public beastService: BeastService
  ) { }

  public roleInfo = null;
  public damageType = ''
  public damageString = ''
  public baseRecovery = 0
  public recovery = 0
  public weaponType = ''

  public equipmentLists = { weapons: [] }
  public equipmentObjects = { weapons: {} }
  public showAllEquipment = false
  public controllerWeapons = roles.combatRoles.secondary.Controller.weapons
  public primaryRoleDefault = roles.combatRoles.primary

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
  public otherStats = [
    {
      label: 'Attack',
      stat: 'attack'
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

  bootUpAutoComplete() {
    this.weaponControl = new FormControl(this.equipmentLists.weapons);
    this.weaponGroupOptions = this.weaponControl.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => {
          let weaponList = this.primaryRole && !this.showAllEquipment ? this.primaryRoleDefault[this.primaryRole].weapons : this.equipmentLists.weapons
          if (this.secondaryRole === 'Controller' && !this.showAllEquipment) {
            weaponList = [...this.controllerWeapons, ...weaponList]
          }
          return this._filterGroup(value, weaponList)
        })
      );
  }

  private _filterGroup(value: string, groups: any): any[] {
    if (value) {
      return groups
        .map(group => ({ label: group.label, items: this._filter(group.items || [], value) }))
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
      let weaponOnRoleList = false
      if (this.combatStats.weapon) {
        this.primaryRoleDefault[this.primaryRole].weapons.forEach(weaponCat => {
          weaponCat.items.forEach(weaponToCheck => {
            if (weaponToCheck === this.combatStats.weapon) {
              weaponOnRoleList = true
            }
          })
        })
      }

      this.showAllEquipment = this.combatStats.weapon && !weaponOnRoleList
    }
  }

  getCombatSquare() {
    this.setAttackInfo(this.index)
  }

  setRoleInfo = () => {
    if (this.primaryRole) {
      this.weaponType = this.primaryRoleDefault[this.primaryRole].weapontype
      if (this.combatStats.weapontype) {
        if (this.combatStats.weapontype === 'm') {
          this.roleInfo = this.primaryRoleDefault[this.primaryRole].meleeCombatStats
        } else if (this.combatStats.weapontype === 'r') {
          this.roleInfo = this.primaryRoleDefault[this.primaryRole].rangedCombatStats
        }
      } else {
        if (this.primaryRoleDefault[this.primaryRole].weapontype === 'm') {
          this.roleInfo = this.primaryRoleDefault[this.primaryRole].meleeCombatStats
        } else if (this.primaryRoleDefault[this.primaryRole].weapontype === 'r') {
          this.roleInfo = this.primaryRoleDefault[this.primaryRole].rangedCombatStats
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

  getAdjustment = async (type, event) => {
    this.combatStats[type] = +event.target.value

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
    if (stat === 'swarmbonus') {
      this.combatStats.addsizemod = !event.checked
    }
    this.getCombatSquare()
  }

  captureSelected = (event, type) => {
    if (event.value) {
      this.combatStats[type] = event.value
    } else if (event.option) {
      this.combatStats[type] = event.option.value
    } else {
      this.combatStats[type] = null
    }

    if (type === 'weapon' && this.combatStats.measure !== 'none') {
      this.checkOtherStat('measure', 'none', event)
    } else if (type === 'weapon' && !event.option.value) {
      this.checkOtherStat('measure', null, event)
    }

    this.getCombatSquare()
  }

  captureInput = (event, type) => {
    this.combatStats[type] = event.target.value
  }

  captureHTML = (event, type) => {
    this.combatStats[type] = event.html
  }

}
