import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CombatStatsService } from 'src/app/util/services/combatStats.service.js';
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
    public combatStatsService: CombatStatsService
  ) { }

  public roleInfo = null;
  public damageType = ''
  public damageString = ''
  public baseRecovery = 0
  public recovery = 0
  public vitality = 0
  public stressThreshold = 0
  public panic = 0
  public weaponType = ''

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

  ngOnChanges(changes) {
    this.setRoleInfo()
    this.setDamageDice()
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

  getModifiedStats = (stat) => {
    return this.combatStatsService.getModifiedStatsRounded(stat, this.combatStats, this.roleInfo, this.points)
  }

  getModifiedStatsMinZero = (stat) => {
    return this.combatStatsService.getModifiedStatsMinZero(stat, this.combatStats, this.roleInfo, this.points)
  }

  getModifiedStatWithSize = (stat) => {
    const modifiedStat = this.combatStatsService.getModifiedStatsRounded(stat, this.combatStats, this.roleInfo, this.points)
    if (!this.combatStats.addsizemod) {
      return modifiedStat
    }
    const measureModDictionary = {
      Fine: -4,
      Diminutive: -3,
      Tiny: -2,
      Small: -1,
      Medium: 0,
      Large: 1,
      Huge: 2,
      Giant: 3,
      Enormous: 4,
      Colossal: 5
    }
    const defenseModDictionary = {
      Fine: 12,
      Diminutive: 9,
      Tiny: 6,
      Small: 3,
      Medium: 0,
      Large: -3,
      Huge: -6,
      Giant: -9,
      Enormous: -12,
      Colossal: -15
    }

    if (stat === 'all') {
      return modifiedStat + defenseModDictionary[this.size]
    }else if (stat === 'measure') {
      return modifiedStat + measureModDictionary[this.size]
    }
    return modifiedStat
  }

  setDamageDice() {
    if (this.combatStats.isSpecial === 'yes') {
      this.damageString = '*'
      return false
    }

    let scalingStrength;

    if (this.combatStats.piercingweapons) {
      scalingStrength = this.combatStats.piercingweapons
      this.damageType = 'P'
    } else if (this.combatStats.crushingweapons) {
      scalingStrength = this.combatStats.crushingweapons
      this.damageType = 'C'
    } else if (this.combatStats.slashingweapons) {
      scalingStrength = this.combatStats.slashingweapons
      this.damageType = 'S'
    } else {
      scalingStrength = this.roleInfo.damage
      if (this.roleInfo.preferreddamage === 'piercingweapons') {
        this.damageType = 'P'
      } else if (this.roleInfo.preferreddamage === 'crushingweapons') {
        this.damageType = 'C'
      } else if (this.roleInfo.preferreddamage === 'slashingweapons') {
        this.damageType = 'S'
      } else {
        scalingStrength = null
        this.damageType = ''
      }
    }

    const scaling = this.combatStatsService.getDamageScalingInfo(this.damageType);

    let modifiedPoints
    if (scalingStrength === 'noneWk') {
      modifiedPoints = scaling.scaling.majWk
    } else if (scalingStrength === 'none') {
      modifiedPoints = scaling.scaling.none
    } else {
      modifiedPoints = scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * this.points)
    }

    if (modifiedPoints <= 0) {
      modifiedPoints = 1
    }

    let crushingDamageMod = 0
    let diceObject = {
      d3s: 0,
      d4s: 0,
      d6s: 0,
      d8s: 0,
      d10s: 0,
      d12s: 0,
      d20s: 0,
    }

    if (this.damageType === 'S') {
      diceObject.d4s += Math.floor(modifiedPoints / 2)
      let leftover = modifiedPoints % 2
      if (leftover === 1) {
        diceObject.d3s += 1
      }
    } else if (this.damageType === 'P') {
      diceObject.d8s += Math.floor(modifiedPoints / 4)
      let leftover = modifiedPoints % 4
      if (leftover === 1) {
        diceObject.d3s += 1
      } else if (leftover === 2) {
        diceObject.d4s += 1
      } else if (leftover === 3) {
        diceObject.d6s += 1
      }
    } else {
      diceObject.d20s += Math.floor(modifiedPoints / 7)
      if (modifiedPoints === 1) {
        diceObject.d4s += 1
      } else if (modifiedPoints === 2) {
        diceObject.d6s += 1
      } else if (modifiedPoints === 3) {
        diceObject.d8s += 1
      } else if (modifiedPoints === 4) {
        diceObject.d10s += 1
      } else if (modifiedPoints === 5) {
        diceObject.d12s += 1
      } else if (modifiedPoints === 6) {
        diceObject.d20s += 1
      } else {
        diceObject.d20s += 1
        crushingDamageMod = modifiedPoints - 6
      }
    }

    let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

    let diceString = ''
    let baseRecovery = 0

    if (d3s > 0) {
      diceString += `${d3s}d3!`
      baseRecovery += d3s * this.combatStatsService.getRecoveryFromDiceSize('d3')
    }
    if (d4s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
      baseRecovery += d4s * this.combatStatsService.getRecoveryFromDiceSize('d4')
    }
    if (d6s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
      baseRecovery += d6s * this.combatStatsService.getRecoveryFromDiceSize('d6')
    }
    if (d8s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
      baseRecovery += d8s * this.combatStatsService.getRecoveryFromDiceSize('d8')
    }
    if (d10s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
      baseRecovery += d10s * this.combatStatsService.getRecoveryFromDiceSize('d10')
    }
    if (d12s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
      baseRecovery += d12s * this.combatStatsService.getRecoveryFromDiceSize('d12')
    }
    if (d20s > 0) {
      diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
      baseRecovery += d20s * this.combatStatsService.getRecoveryFromDiceSize('d20')
    }

    if (crushingDamageMod) {
      diceString += ` +${crushingDamageMod}`
    }

    this.baseRecovery = baseRecovery
    this.setModifiedRecovery()

    if (this.combatStats.isSpecial === 'kinda') {
      diceString += '*'
    }

    this.damageString = diceString
  }

  setModifiedRecovery = () => {
    let scalingStrength;

    if (this.combatStats.recovery) {
      scalingStrength = this.combatStats.recovery
    } else {
      scalingStrength = this.roleInfo.recovery
    }

    const scaling = this.combatStatsService.getStatScaling('recovery')

    if (scalingStrength === 'noneWk') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.majWk)
    } else if (scalingStrength === 'none') {
      this.recovery = Math.ceil(this.baseRecovery * scaling.scaling.none)
    } else {
      this.recovery = Math.ceil((scaling.scaling[scalingStrength] * this.baseRecovery) - (scaling.bonus[scalingStrength] * this.points))
    }
  }

  getCover = () => {
    const cover = this.combatStatsService.getModifiedStatsMinZero('rangeddefense', this.combatStats, this.roleInfo, this.points)
    if (cover > 0) {
      const crouchedCover = cover * 1.5

      if (crouchedCover >= 20) {
        return `+${cover}(*)`
      } else {
        return `+${cover}(+${crouchedCover})`
      }
    } else {
      return '+0'
    }
  }

  getBaseDR = () => {
    const slashDR = this.combatStatsService.getModifiedStatsRounded('weaponsmallslashing', this.combatStats, this.roleInfo, this.points)
    const staticDR = this.combatStatsService.getModifiedStatsRounded('weaponsmallcrushing', this.combatStats, this.roleInfo, this.points)

    return this.getDR(slashDR, staticDR)
  }

  getParryDR = () => {
    const slashDR = this.combatStatsService.getModifiedStatsRounded('andslashing', this.combatStats, this.roleInfo, this.points)
    const staticDR = this.combatStatsService.getModifiedStatsRounded('andcrushing', this.combatStats, this.roleInfo, this.points)

    return this.getDR(slashDR, staticDR)
  }

  getDR = (slashDR, staticDR) => {
    if (slashDR > 0 && staticDR > 0) {
      return `${slashDR}/d +${staticDR}`
    } else if (slashDR > 0) {
      return `${slashDR}/d`
    } else if (staticDR > 0) {
      return `${staticDR}`
    } else {
      return 0
    }
  }

  getWeaponType = () => {
    if (this.combatStats.weapontype) {
      return this.combatStats.weapontype
    }
    return this.weaponType
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

    this.setDamageDice()
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

    if (stat === 'recovery') {
      this.setModifiedRecovery()
    }
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
  }

  checkBasicStat = (stat, value, event) => {
    if (this.combatStats[stat] === value) {
      event.source._checked = false
      this.combatStats[stat] = null
    } else {
      this.combatStats[stat] = value
    }

    if (stat === 'isSpecial') {
      this.setDamageDice()
    }
  }

  checkBasicStatOnOff = (stat, event) => {
    this.combatStats[stat] = event.checked
  }

  captureSelect = (event, type) => {
    this.combatStats[type] = event.value

    if (type === 'weapontype') {
      this.setRoleInfo()
    }
  }

}
