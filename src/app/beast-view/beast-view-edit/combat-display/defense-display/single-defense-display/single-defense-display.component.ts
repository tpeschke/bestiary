import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service.js';
import roles from '../../../../roles.js'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-single-defense-display',
  templateUrl: './single-defense-display.component.html',
  styleUrls: ['../../../../beast-view.component.css', './../../../combat-info/combat-info.component.css', './single-defense-display.component.css']
})
export class SingleDefenseDisplayComponent implements OnInit {
  @Input() primaryRole: any;
  @Input() secondaryRole: any;
  @Input() combatStats: any;
  @Input() points: any;
  @Input() physical: any;
  @Input() removeCallback: Function
  @Input() index: any
  @Input() size: any = "Medium";
  @Input() setDefenseInfo: Function;
  @Input() defaultname: any;

  armorControl: any;
  armorGroupOptions: Observable<any[]>;

  shieldControl: any;
  shieldGroupOptions: Observable<any[]>;

  constructor(
    public beastService: BeastService
  ) { }

  public roleInfo = null;

  public equipmentLists = { armor: [], shields: [] }
  public equipmentObjects = { armor: {}, shields: {} }
  public showAllEquipment = false
  public primaryRoleDefault = roles.combatRoles.primary

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

  ngOnInit() {
    this.getCombatSquare()
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
      this.bootUpAutoComplete()
    })

    this.checkShowAllEquipment()
  }

  bootUpAutoComplete() {
    this.armorControl = new FormControl(this.equipmentLists.armor);
    this.armorGroupOptions = this.armorControl.valueChanges
      .pipe(
        startWith(this.combatStats.armor || ''),
        map((value: string) => {
          if (this.primaryRole && !this.showAllEquipment) {
            return [{ label: 'Preferred Armor', items: this._filter(this.primaryRoleDefault[this.primaryRole].armor || [], value) }]
          } else {
            return this._filterGroup(value, this.equipmentLists.armor)
          }
        })
      );
    this.shieldControl = new FormControl(this.equipmentLists.shields);
    this.shieldGroupOptions = this.shieldControl.valueChanges
      .pipe(
        startWith(this.combatStats.shield || ''),
        map((value: string) => {
          if (this.primaryRole && !this.showAllEquipment) {
            return [{ label: 'Preferred Shields', items: this._filter(this.primaryRoleDefault[this.primaryRole].shields || [], value) }]
          } else {
            return this._filterGroup(value, this.equipmentLists.shields)
          }
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
      if (this.combatStats.armor) {
        this.primaryRoleDefault[this.primaryRole].armor.forEach(armorToCheck => {
          if (armorToCheck === this.combatStats.armor) {
            armorOnRoleList = true
          }
        })
      }
      if (this.combatStats.shield) {
        this.primaryRoleDefault[this.primaryRole].shields.forEach(shieldToCheck => {
          if (shieldToCheck === this.combatStats.shield) {
            shieldOnRoleList = true
          }
        })
      }

      this.showAllEquipment = (this.combatStats.armor && !armorOnRoleList) || (this.combatStats.shield && !shieldOnRoleList)
    }
  }

  getCombatSquare() {
      this.setDefenseInfo(this.index)
  }

  setRoleInfo = () => {
    if (this.primaryRole) {
      const weaponType = this.primaryRoleDefault[this.primaryRole].weapontype
      if (weaponType === 'm') {
        this.roleInfo = this.primaryRoleDefault[this.primaryRole].meleeCombatStats
      } else if (weaponType === 'r') {
        this.roleInfo = this.primaryRoleDefault[this.primaryRole].rangedCombatStats
      }
    }
  }

  getAdjustment = async (type, event) => {
    this.combatStats[type] = +event.target.value

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

    this.getCombatSquare()
  }

  captureInput = (event, type) => {
    this.combatStats[type] = event.target.value
  }

  captureHTML = (event, type) => {
    this.combatStats[type] = event.html
  }
}
