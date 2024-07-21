import { Component, OnInit, Input } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import roles from '../../roles.js'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-combat-square',
  templateUrl: './combat-square.component.html',
  styleUrls: ['../../beast-view.component.css', './combat-square.component.css']
})
export class CombatSquareComponent implements OnInit {
  @Input() baseCombatSquare: any;
  @Input() combatStats: any;
  @Input() primaryRole: any
  @Input() secondaryRole: any
  @Input() points: any
  @Input() skillpoints: any
  @Input() socialpoints: any
  @Input() size: any
  @Input() passOnEquipmentChanges: Function
  @Input() increaseInitiative: Function

  weaponControl: any;
  weaponGroupOptions: Observable<any[]>;

  armorControl: any;
  armorGroupOptions: Observable<any[]>;

  shieldControl: any;
  shieldGroupOptions: Observable<any[]>;

  constructor(
    public beastService: BeastService
  ) { }

  public combatSquare

  showEquipmentSelection = false
  public weaponType = ''
  public roleInfo = null

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }
  public showAllEquipment = false
  public controllerWeapons = roles.combatRoles.secondary.Controller.weapons
  public primaryRoles = roles.combatRoles.primary

  ngOnInit() {
    this.combatSquare = this.baseCombatSquare
    this.beastService.getEquipment().subscribe(res => {
      this.equipmentLists = res.lists
      this.equipmentObjects = res.objects
      this.bootUpAutoComplete()
    })

    this.checkShowAllEquipment()
  }

  ngOnChanges(changes) {
    if (this.combatSquare) {
      this.setRoleInfo()
    }
    this.bootUpAutoComplete()
  }

  getCombatSquare() {
    this.beastService.getCombatSquare(this.combatStats, this.primaryRole, this.points, this.size).subscribe(res => {
      this.combatSquare = { ...this.combatSquare, ...res }
    })
  }

  setRoleInfo = () => {
    if (this.primaryRole) {
      this.weaponType = roles.combatRoles.primary[this.primaryRole].weapontype
      if (this.combatSquare.weapontype) {
        if (this.combatSquare.weapontype === 'm') {
          this.roleInfo = roles.combatRoles.primary[this.primaryRole].meleeCombatStats
        } else if (this.combatSquare.weapontype === 'r') {
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

  bootUpAutoComplete() {
    this.weaponControl = new FormControl(this.equipmentLists.weapons);
    this.weaponGroupOptions = this.weaponControl.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => {
          let weaponList = this.primaryRole && !this.showAllEquipment ? this.primaryRoles[this.primaryRole].weapons : this.equipmentLists.weapons
          if (this.secondaryRole === 'Controller' && !this.showAllEquipment) {
            weaponList = [...this.controllerWeapons, ...weaponList]
          }
          return this._filterGroup(value, weaponList)
        })
      );
    this.armorControl = new FormControl(this.equipmentLists.weapons);
    this.armorGroupOptions = this.armorControl.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => {
          if (this.primaryRole && !this.showAllEquipment) {
            return [{ label: 'Preferred Armor', items: this._filter(this.primaryRoles[this.primaryRole].armor || [], value) }]
          } else {
            return this._filterGroup(value, this.equipmentLists.armor)
          }
        })
      );
    this.shieldControl = new FormControl(this.equipmentLists.weapons);
    this.shieldGroupOptions = this.shieldControl.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => {
          if (this.primaryRole && !this.showAllEquipment) {
            return [{ label: 'Preferred Shields', items: this._filter(this.primaryRoles[this.primaryRole].shields || [], value) }]
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

  isASwarmBonus = (name) => {
    if (name) {
      return name.includes('Swarm Bonus')
    } 
    return false
  }

  checkShowAllEquipment = () => {
    if (this.primaryRole) {
      let armorOnRoleList = false
      let shieldOnRoleList = false
      let weaponOnRoleList = false
      if (this.combatSquare.weapon) {
        this.primaryRoles[this.primaryRole].weapons.forEach(weaponCat => {
          weaponCat.items.forEach(weaponToCheck => {
            if (weaponToCheck === this.combatSquare.weapon) {
              weaponOnRoleList = true
            }
          })
        })
      }
      if (this.combatSquare.armor) {
        this.primaryRoles[this.primaryRole].armor.forEach(armorToCheck => {
          if (armorToCheck === this.combatSquare.armor) {
            armorOnRoleList = true
          }
        })
      }
      if (this.combatSquare.shield) {
        this.primaryRoles[this.primaryRole].shields.forEach(shieldToCheck => {
          if (shieldToCheck === this.combatSquare.shield) {
            shieldOnRoleList = true
          }
        })
      }

      this.showAllEquipment = (this.combatSquare.armor && !armorOnRoleList) || (this.combatSquare.shield && !shieldOnRoleList) || (this.combatSquare.weapon && !weaponOnRoleList)
    }
  }

  checkComponentVariable = (stat, event) => {
    this[stat] = event.checked

    if (stat === 'showAllEquipment') {
      this.bootUpAutoComplete()
    }
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

  toggleEquipmentSelection = () => {
    this.showEquipmentSelection = !this.showEquipmentSelection
  }

  saveEquipmentChange = () => {
    this.showEquipmentSelection = false
    if (this.passOnEquipmentChanges) {
      this.passOnEquipmentChanges({id: this.combatStats.id, weapon: this.combatStats.weapon, armor: this.combatStats.armor, shield: this.combatStats.shield})
    }
  }

  backOutofSwap = () => {
    this.combatSquare = this.baseCombatSquare
    this.showEquipmentSelection = false
  }

}
