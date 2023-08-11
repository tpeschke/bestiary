import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service.js';
import roles from '../../roles.js'

@Component({
  selector: 'app-combat-info',
  templateUrl: './combat-info.component.html',
  styleUrls: ['../../beast-view.component.css', './combat-info.component.css']
})
export class CombatInfoComponent implements OnChanges {
  @Input() primaryRole: any;
  @Input() combatStats: any;
  @Input() points: any;
  @Input() physical: any;
  @Input() physicalCallback: Function
  @Input() size: any = "Medium";

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
    })
  }

  ngOnChanges(changes) {
    this.setRoleInfo()
    this.getCombatSquare()
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

  checkBasicStatOnOff = (stat, event) => {
    this.combatStats[stat] = event.checked
    
    this.getCombatSquare()
  }

  captureSelect = (event, type) => {
    this.combatStats[type] = event.value

    this.getCombatSquare()

    if (type === 'armor' || type === 'shield') {
      this.physicalCallback()
    }
  }

}
