import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import variables from '../../../local.js'
import { CalculatorService } from '../../util/services/calculator.service';
import lootTables from "../loot-tables.js"
import roles from '../roles.js'
import { MatExpansionPanel, MatSelect } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CombatStatsService } from 'src/app/util/services/combatStats.service';

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewEditComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('newRoleName') newRoleName;
  @ViewChild('artistName') artistName;
  @ViewChild('artistLink') artistLink;
  @ViewChild('artistTooltip') artistTooltip;
  @ViewChild('roleSelect') roleSelect;
  @ViewChild('newCombatRoleSelect') newCombatRoleSelect: MatSelect;
  @ViewChild('newSecondaryRoleSelect') newSecondaryRoleSelect: MatSelect;
  @ViewChild('newConfRoleSelect') newConfRoleSelect: MatSelect;
  @ViewChild('newSkillRoleSelect') newSkillRoleSelect: MatSelect;
  @ViewChild('newSecondaryConfRoleSelect') newSecondaryConfRoleSelect: MatSelect;
  imageObj: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    public combatStatsService: CombatStatsService
  ) { }

  objectKeys = Object.keys;

  public beast = null;
  public encounter = null;
  public loggedIn = this.beastService.loggedIn || false;
  public types = null;
  public environ = null;
  public imageBase = variables.imageBase;
  public uploader: any;
  public newVariantId = null;
  public newChallengeId = null;
  public newObstacleId = null;
  public averageVitality = null;
  public lootTables = lootTables;

  public displayFatigue = null;
  public displayPanic = null;
  public hiddenPanic = null;
  public fatigueAsVitality: any = '';

  public mental = {
    stress: null,
    panic: null,
    caution: null
  }
  public physical = {
    largeweapons: null,
    fatigue: null,
    diceString: ''
  }

  public selectedRoleId = null;
  public filteredRoles = [];
  public selectedRole: any = {}
  public selectedSocialRole = {}
  public selectedSkillRole = {}
  public imageUrl = null;
  public unusedRolesForEncounters = []
  public allFlaws;
  public newRole = {
    name: null,
    role: null,
    secondaryrole: null,
    socialrole: null,
    skillrole: null,
    socialsecondary: null
  };
  public deletedSpellList = null;

  public mentalStats = [
    {
      label: 'Mental',
      stat: 'mental',
      tooltip: 'Stress Threshold'
    },
    {
      label: 'Panic',
      stat: 'panic',
    },
    {
      label: 'Caution',
      stat: 'caution',
    },
  ]
  public physicalStats = [
    {
      label: 'Vitality',
      stat: 'largeweapons',
    },
    {
      label: 'Fatigue',
      stat: 'fatigue',
    },
    {
      label: 'Caution',
      stat: 'caution',
    },
  ]

  public movementStats = [
    {
      label: 'Crawl',
      stat: 'crawlstrength',
      speed: 'crawlspeed',
    },
    {
      label: 'Walk',
      stat: 'walkstrength',
      speed: 'walkspeed',
    },
    {
      label: 'Jog',
      stat: 'jogstrength',
      speed: 'jogspeed',
    },
    {
      label: 'Run',
      stat: 'runstrength',
      speed: 'runspeed',
    },
    {
      label: 'Sprint',
      stat: 'sprintstrength',
      speed: 'sprintspeed',
    },
  ]

  public temperament = {
    temperament: null,
    tooltip: null,
    weight: null
  };
  public signs = {
    sign: null,
    weight: null
  }
  public rank = {
    rank: null,
    weight: null,
    othertypechance: null,
    decayrate: null,
    lair: null
  }
  public verb = {
    verb: null
  }
  public noun = {
    noun: null
  }

  public equipment = {
    number: null,
    value: null
  }

  public traited = {
    chancetable: null,
    value: null
  }

  public scroll = {
    number: null,
    power: null
  }

  public alm = {
    number: null,
    favor: null
  }

  public artist = {
    id: null,
    artist: null,
    tooltip: null,
    link: null
  }

  public numbers = {
    numbers: null,
    miles: null,
    weight: null
  }

  public groups = {
    weight: null,
    label: null,
    weights: []
  }

  public folklore = {
    belief: null,
    truth: null
  }

  public weights = []

  combatRolesInfo = roles.combatRoles.primary;
  combatRolesSecondaryInfo = roles.combatRoles.secondary
  socialRolesInfo = roles.socialRoles.primary;
  socialRolesSecondaryInfo = roles.socialRoles.secondary
  skillRolesInfo = roles.skillRoles;

  public combatSkills = ['Endurance', 'Jumping', 'Climbing', 'Move Silently', 'Hiding', 'Swimming', 'Acrobatics', 'Escape Artist', 'Warfare', 'Rally', 'Athletics Skill Suite', 'Strategy Skill Suite']
  public socialSkills = ['Deception', 'Intuition', 'Perception', 'Leadership', 'Articulation', 'Performance', 'Language (All)', 'Language']

  public temperamentController = new FormControl('');
  public tempFiltered: Observable<any[]>;

  public verbController = new FormControl('');
  public verbFiltered: Observable<any[]>;

  public nounController = new FormControl('');
  public nounFiltered: Observable<any[]>;

  public signsController = new FormControl('');
  public signsFiltered: Observable<any[]>;

  public artistController = new FormControl('');
  public artistFiltered: Observable<any[]>;

  ngOnInit() {
    this.route.data.subscribe(data => {
      let beast = data['beast']
      if (this.route.snapshot.params.templateId) {
        beast.variants.push({ variantid: beast.id })
        delete beast.id
        beast.name = beast.name + " Template"
        this.beast = beast

        if (!this.beast.casting) {
          this.beast.casting = {
            augur: null,
            wild: null,
            vancian: null,
            spellnumberdie: 'd4',
            manifesting: null,
            commanding: null,
            bloodpact: null
          }
        }

        let roleIdsDictionary = {}
        this.beast.roles = this.beast.roles.map(role => {
          const newId = this.makeId()
          roleIdsDictionary[role.id] = newId

          this.beast.roleInfo[newId] = this.beast.roleInfo[role.id]
          delete this.beast.roleInfo[role.id]

          if (this.beast.defaultrole === role.id) {
            this.beast.defaultrole = newId
            this.setRole({ value: this.beast.defaultrole })
          }

          role.id = newId
          delete role.beastid
          role.hash = null

          return role
        })

        this.beast.artistInfo = { ...this.beast.artistInfo, artist: null, artistid: null, beastid: null, id: null, link: null, tooltip: null }

        this.beast.combat = this.beast.combat.map(combat => {
          if (combat.roleid) {
            combat.roleid = roleIdsDictionary[combat.roleid]
          }
          delete combat.id
          delete combat.beastid

          return combat
        })

        this.beast.conflict.descriptions = this.beast.conflict.descriptions.map(socialObject => {
          if (socialObject.socialroleid) {
            socialObject.socialroleid = roleIdsDictionary[socialObject.socialroleid]
          }
          delete socialObject.id
          delete socialObject.beastid
          return socialObject
        })

        this.beast.conflict.convictions = this.beast.conflict.convictions.map(socialObject => {
          if (socialObject.socialroleid) {
            socialObject.socialroleid = roleIdsDictionary[socialObject.socialroleid]
          }
          delete socialObject.id
          delete socialObject.beastid
          return socialObject
        })

        this.beast.conflict.devotions = this.beast.conflict.devotions.map(socialObject => {
          if (socialObject.socialroleid) {
            socialObject.socialroleid = roleIdsDictionary[socialObject.socialroleid]
          }
          delete socialObject.id
          delete socialObject.beastid
          return socialObject
        })

        this.beast.conflict.flaws = this.beast.conflict.flaws.map(socialObject => {
          if (socialObject.socialroleid) {
            socialObject.socialroleid = roleIdsDictionary[socialObject.socialroleid]
          }
          delete socialObject.id
          delete socialObject.beastid
          return socialObject
        })

        this.beast.skills = this.beast.skills.map(skill => {
          if (skill.skillroleid) {
            skill.skillroleid = roleIdsDictionary[skill.skillroleid]
          }
          delete skill.id
          delete skill.beastid
          return skill
        })

        this.beast.reagents = this.beast.reagents.map(reagent => {
          delete reagent.id
          delete reagent.beastid
          return reagent
        })

        this.beast.movement = this.beast.movement.map((movementObject, i) => {
          if (movementObject.roleid) {
            movementObject.roleid = roleIdsDictionary[movementObject.roleid]
          }
          let roleInfo;
          if (movementObject.roleid) {
            roleInfo = this.combatRolesInfo[this.beast.roleInfo[movementObject.roleid].role].meleeCombatStats
          }
          movementObject.movementSpeeds = this.calculateMovementSpeed(i, roleInfo, this.beast.roleInfo[movementObject.roleid].combatpoints)
          delete movementObject.id
          delete movementObject.beastid
          return movementObject
        })

        this.beast.folklore = this.beast.folklore.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.loot = this.beast.loot.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        delete this.beast.lairloot.id
        delete this.beast.lairloot.beastid

        this.beast.lairloot.traited = this.beast.lairloot.traited.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.lairloot.equipment = this.beast.lairloot.equipment.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.lairloot.scrolls = this.beast.lairloot.scrolls.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.lairloot.alms = this.beast.lairloot.alms.map(item => {
          delete item.id
          delete item.beastid
          return item
        })


        delete this.beast.carriedloot.id
        delete this.beast.carriedloot.beastid

        this.beast.carriedloot.traited = this.beast.carriedloot.traited.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.carriedloot.equipment = this.beast.carriedloot.equipment.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.carriedloot.scrolls = this.beast.carriedloot.scrolls.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        this.beast.carriedloot.alms = this.beast.carriedloot.alms.map(item => {
          delete item.id
          delete item.beastid
          return item
        })

        delete this.beast.casting.id
        delete this.beast.casting.beastid

        this.beast.spells = this.beast.spells.map(spells => {
          if (spells.roleid) {
            spells.roleid = roleIdsDictionary[spells.roleid]
          }
          delete spells.id
          delete spells.beastid
          return spells
        })

        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        }
        this.beast.patreon = 20
        this.beastService.getEditEncounter(this.route.snapshot.params.templateId).subscribe(encounter => {
          this.encounter = encounter
          this.bootUpEncounterAutoComplete()
        })
      } else if (beast) {
        this.beast = beast

        if (!this.beast.casting) {
          this.beast.casting = {
            augur: null,
            wild: null,
            vancian: null,
            spellnumberdie: 'd4',
            manifesting: null,
            commanding: null,
            bloodpact: null
          }
        }

        this.beast.movement = this.beast.movement.map((val, i) => {
          let roleInfo;
          if (val.roleid) {
            roleInfo = this.combatRolesInfo[this.beast.roleInfo[val.roleid].role].meleeCombatStats
          }
          val.movementSpeeds = this.calculateMovementSpeed(i, roleInfo, this.beast.roleInfo[val.roleid].combatpoints)
          return val
        })

        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        }
        this.beastService.getEditEncounter(this.beast.id).subscribe(encounter => {
          this.encounter = encounter
          this.bootUpEncounterAutoComplete()
        })
        this.getImageUrl()
      } else {
        this.beastService.getEditEncounter(0).subscribe(encounter => {
          this.encounter = encounter
          this.bootUpEncounterAutoComplete()
        })
        this.beast = {
          name: '',
          hr: 0,
          intro: '',
          habitat: '',
          ecology: '',
          number_min: 0,
          number_max: 0,
          senses: '',
          diet: '',
          meta: '',
          sp_atk: '',
          sp_def: '',
          tactics: '',
          size: '',
          int: 0,
          subsystem: 0,
          patreon: 20,
          vitality: '',
          panic: '',
          stress: 0,
          combat: [],
          combatStatArray: [],
          conflict: { descriptions: [], convictions: [], devotions: [], flaws: [] },
          skills: [],
          movement: [],
          types: [],
          environ: [],
          variants: [],
          loot: [],
          lootnotes: '',
          reagents: [],
          locationalvitality: [],
          lairloot: {},
          carriedloot: {},
          roles: [],
          folklore: [],
          roleInfo: {},
          casting: {
            augur: null,
            wild: null,
            vancian: null,
            spellnumberdie: 'd4',
            manifesting: null,
            commanding: null,
            bloodpact: null
          },
          challenges: [],
          obstacles: [],
          artistInfo: {},
          plural: null
        }
      }
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      this.beast.roles.forEach(role => {
        if (role.vitality) {
          this.beast.roleInfo[role.id].average = this.calculatorService.rollDice(role.vitality)
        }
      })

      this.beastService.getFlaws().subscribe((results: any) => {
        delete results.flawTables
        let newAllFlaws = []
        for (const key in results) {
          newAllFlaws.push({
            label: key.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            flaws: results[key]
          })
        }
        this.allFlaws = newAllFlaws
      })

      this.bootUpAutoCompletes()

      this.setDefaultRole()
      this.setStressAndPanic()
      this.setVitalityAndFatigue()

      this.calculateCombatPoints()
      this.calculateSocialPoints()
      this.calculateSkillPoints()

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })
  }

  _filterGroup = (value, groups, type) => {
    if (value) {
      return groups
        .map(group => ({ label: group.label, flaws: this._filter(value, group.flaws, type) }))
        .filter(group => group.label.length > 0);
    }

    return groups;
  }

  bootUpAutoCompletes() {
    this.artistFiltered = this.artistController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.beast.artistInfo.allartists, 'artist')),
    );
    this.artistController.setValue(this.beast.artistInfo)
  }

  bootUpEncounterAutoComplete() {
    this.tempFiltered = this.temperamentController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.encounter.temperament.allTemp, 'temperament')),
    );
    this.verbFiltered = this.verbController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.encounter.verb.allVerb, 'verb')),
    );
    this.nounFiltered = this.nounController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.encounter.noun.allNoun, 'noun')),
    );
    this.signsFiltered = this.signsController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.encounter.signs.allSigns, 'sign')),
    );
  }

  private _filter(value: any, encounterArray: any, type: string): string[] {
    let filterValue: string
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value[type].toLowerCase();
    }
    return encounterArray.filter(option => {
      return option[type].toLowerCase().includes(filterValue)
    });
  }

  captureHTML(event, type) {
    if (type.includes('role')) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.beast.roles[i].id === this.selectedRoleId) {
          if (type === 'role attack') {
            this.beast.roles[i].attack = event.html
          } else if (type === 'role defense') {
            this.beast.roles[i].defense = event.html
          }
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast = Object.assign({}, this.beast, { [type]: event.html })
    }
  }

  captureRoleName = (event) => {
    this.beast.roleInfo[this.selectedRoleId].name = event.target.value
    this.beast.roles.forEach(role => {
      if (role.id === this.selectedRoleId) {
        role.name = event.target.value
      }
    })
  }

  captureBasicInput = (event, type) => {
    this.beast.roleInfo[this.selectedRoleId][type] = event.target.value

    this.setVitalityAndFatigue()
    this.setStressAndPanic()
    this.setCaution()
    this.beast.movement = this.beast.movement.map((val, i) => {
      let roleInfo;
      if (val.roleid) {
        roleInfo = this.combatRolesInfo[this.beast.roleInfo[val.roleid].role].meleeCombatStats
      }
      val.movementSpeeds = this.calculateMovementSpeed(i, roleInfo, this.beast.roleInfo[val.roleid].combatpoints)
      return val
    })
  }

  captureInputUnbound = (event, type, index, secondaryType, thirdType) => {
    if (type === 'conflict') {
      let newSecondaryObject = Object.assign({}, this.beast[type])
      newSecondaryObject[secondaryType] = [...newSecondaryObject[secondaryType]]
      newSecondaryObject[secondaryType][index][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (!secondaryType) {
      let objectToModify = { ...this.beast }
      if (this.selectedRoleId && (type === 'stress' || type === 'caution')) {
        objectToModify = this.beast.roleInfo[this.selectedRoleId]
        this.beast.roleInfo[this.selectedRoleId] = Object.assign({}, objectToModify, { [type]: event.target.value })
        this.updateRolesObject(type, event.target.value)
      } else {
        this.beast = Object.assign({}, objectToModify, { [type]: event.target.value })
      }
      if (type === 'vitality') {
        this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      }
    } else if (secondaryType && !thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    }

    this.calculateCombatPoints()
    this.calculateSocialPoints()
    this.calculateSkillPoints()
  }
  captureInput = this.captureInputUnbound.bind(this)

  checkRandomizeTrait = (index, checked) => {
    if (checked) {
      this.beast.conflict.convictions[index].trait = 'Any'
    } else {
      this.beast.conflict.convictions[index].trait = ''
    }
  }

  checkRandomizeDescription = (index, checked) => {
    if (checked) {
      this.beast.conflict.descriptions[index].trait = 'Any'
    } else {
      this.beast.conflict.descriptions[index].trait = ''
    }
  }

  checkRandomizeFlaw = (index, checked) => {
    if (checked) {
      this.beast.conflict.flaws[index].trait = 'Any'
      if (+this.beast.conflict.flaws[index].value > 4) {
        this.beast.conflict.flaws[index].value = '1'
      }
    } else {
      this.beast.conflict.flaws[index].trait = ''
    }
  }

  checkRandomizeDevotion = (index, checked) => {
    if (checked) {
      this.beast.conflict.devotions[index].trait = 'Any'
      if (+this.beast.conflict.devotions[index].value > 4) {
        this.beast.conflict.devotions[index].value = '1'
      }
    } else {
      this.beast.conflict.devotions[index].trait = ''
    }
  }

  setRankSeverityRank = (index, value) => {
    this.beast.conflict.flaws[index].value = value
  }

  updateRolesObject(type, value) {
    for (let i = 0; i < this.beast.roles.length; i++) {
      if (this.beast.roles[i].id === this.selectedRoleId) {
        this.beast.roles[i][type] = value
        i = this.beast.roles.length
      }
    }
  }

  checkTrauma(checked) {
    this.beast.notrauma = checked
  }

  checkAllRoles = (type, index, checked) => {
    if (type === 'skills') {
      this.beast[type][index].allroles = checked
      this.calculateSkillPoints()
    } else if (type === 'locationalvitality') {
      this.beast.locationalvitality[index].allroles = checked
    } if (type === 'movement') {
      this.beast.movement[index].allroles = checked
    } else {
      this.beast.conflict[type][index].allroles = checked
      this.calculateSocialPoints()
    }
  }

  capturePanic(event) {
    this.calculateSocialPoints()
    this.calculateSkillPoints()
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].panic = event.value
      this.updateRolesObject('panic', event.value)
    } else {
      this.beast.panic = event.value
    }
  }

  captureSelect(event, type, index, secondaryType) {
    if (secondaryType) {
      if (event.value === 'r' && !this.beast[type][index].ranges) {
        this.beast[type][index].ranges = { maxrange: 0 }
      }
      this.beast[type][index][secondaryType] = event.value;
    } else {
      this.beast[type] = event.value
      this.calculateCombatPoints()
      this.calculateSocialPoints()
      this.calculateSkillPoints()
    }
  }

  captureSelectWithRoleConsideration(event, type) {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId][type] = event.value
      this.updateRolesObject(type, event.value)
    } else if (type === 'fatigue') {
      this.beast.basefatigue = event.value
    } else {
      this.beast[type] = event.value
    }
  }

  captureSelectForObject(event, type, secondaryType) {
    if (!event.value) {
      event.value = null
    }
    this.beast[secondaryType][type] = event.value
  }

  getFlawDiceValue = (dice) => {
    switch (dice) {
      case '1d4!':
        return 2
      case '1d6!':
        return 3
      case '1d8!':
        return 4
      case '1d10!':
        return 5
      case '1d12!':
        return 6
      case '1d20!':
        return 10
      default:
        return 2
    }
  }

  getPanicValue = (panicValue) => {
    panicValue = panicValue ? panicValue : 5
    switch (panicValue) {
      case 1:
        return -8;
      case 2:
        return -6;
      case 3:
        return -4;
      case 4:
        return -2;
      case 5:
        return 0;
      case 7:
        return 2;
      default:
        return 0
    }
  }

  captureEquipment(event, type) {
    this.equipment[type] = event.value
  }

  captureAddEquipment(type) {
    this.beast[type].equipment.push(this.equipment)
    this.equipment = {
      number: null,
      value: null
    }
  }

  removeEqupment(index, type) {
    let { equipment } = this.beast[type]
    if (equipment[index].beastid) {
      equipment[index].deleted = true
    } else {
      equipment.splice(index, 1)
    }
  }

  captureTraited(event, type) {
    this.traited[type] = event.value
  }

  captureAddTraited(type) {
    this.beast[type].traited.push(this.traited)
    this.traited = {
      chancetable: null,
      value: null
    }
  }

  removeTraited(index, type) {
    let { traited } = this.beast[type]
    if (traited[index].beastid) {
      traited[index].deleted = true
    } else {
      traited.splice(index, 1)
    }
  }

  captureScroll(event, type) {
    this.scroll[type] = event.value
  }

  captureAddScroll(type) {
    this.beast[type].scrolls.push(this.scroll)
    this.scroll = {
      number: null,
      power: null
    }
  }

  removeScroll(index, type) {
    if (this.beast[type].scrolls[index].beastid) {
      this.beast[type].scrolls[index].deleted = true
    } else {
      this.beast[type].scrolls.splice(index, 1)
    }
  }

  captureAlm(event, type) {
    this.alm[type] = event.value
  }

  captureAddAlm(type) {
    this.beast[type].alms.push(this.alm)
    this.alm = {
      number: null,
      favor: null
    }
  }

  removeAlm(index, type) {
    let { alms } = this.beast[type]
    if (alms[index].beastid) {
      alms[index].deleted = true
    } else {
      alms.splice(index, 1)
    }
  }

  captureChip(event, type) {
    if (type === 'types') {
      this.types = { typeid: +event.value }
    } else if (type === 'environ') {
      this.environ = { environid: +event.value }
    }
  }

  addChip(type) {
    if (this[type]) {
      this.beast[type].push(this[type])
      this[type] = null;
    }
  }

  captureID(event) {
    this.newVariantId = +event.target.value
  }

  captureChallenge(event) {
    this.newChallengeId = +event.target.value
  }

  captureObstacle(event) {
    this.newObstacleId = +event.target.value
  }

  addById() {
    if (this.newVariantId) {
      this.beast.variants.push({ variantid: this.newVariantId })
      this.newVariantId = null;
    }
  }

  addChallengeById() {
    if (this.newChallengeId) {
      this.beast.challenges.push({ challengeid: this.newChallengeId })
      this.newChallengeId = null;
    }
  }

  addObstacleById() {
    if (this.newObstacleId) {
      this.beast.obstacles.push({ obstacleid: this.newObstacleId })
      this.newObstacleId = null;
    }
  }

  addNewSecondaryItem(type, secondType) {
    if (type === 'combat') {
      this.beast[type].push({
        weapon: '',
        spd: 0,
        atk: 0,
        init: 0,
        def: 0,
        Fatigue: "C",
        newDR: {
          flat: 0,
          slash: 0
        },
        newShieldDr: {
          flat: 0,
          slash: 0
        },
        measure: 0,
        addrolemods: true,
        newDamage: {
          dice: [],
          flat: 0,
          isSpecial: false,
          hasSpecialAndDamage: false
        },
        parry: 0,
        weapontype: 'm',
        roleid: this.selectedRoleId,
        damageskill: 0,
        addsizemod: true
      })
    } else if (type === 'combatStatArray') {
      this.beast[type].push({
        roleid: this.selectedRoleId,
        weapontype: null,
        piercingweapons: null,
        slashingweapons: null,
        crushingweapons: null,
        weaponsmallslashing: null,
        weaponsmalcrushing: null,
        weaponsmallpiercing: null,
        andslashing: null,
        andcrushing: null,
        flanks: null,
        rangeddefence: null,
        all: null,
        allaround: null,
        armorandshields: null,
        unarmored: null,
        attack: null,
        caution: null,
        fatigue: null,
        initiative: null,
        measure: null,
        panic: null,
        rangedistance: null,
        recovery: null,
        largeweapons: null,
        isspecial: null,
        eua: false,
        addsizemod: true,
        weapon: null,
        shield: null,
        armor: null
      })
    } else if (type === 'movement') {
      let movement = {
        stroll: 0,
        walk: 0,
        jog: 0,
        run: 0,
        sprint: 0,
        type: '',
        roleid: this.selectedRoleId
      }
      let roleInfo;
      if (movement.roleid) {
        roleInfo = this.combatRolesInfo[this.beast.roleInfo[movement.roleid].role].meleeCombatStats
      }
      this.beast[type].push(movement)
      this.beast.movement[this.beast.movement.length - 1].movementSpeeds = this.calculateMovementSpeed(this.beast.movement.length - 1, roleInfo, this.beast.roleInfo[movement.roleid].combatpoints)
    } else if (type === 'conflict') {
      let traitType = secondType === 'descriptions' ? 'h' : secondType.substring(0, 1);
      this.beast[type][secondType].push({
        trait: '',
        value: '',
        type: traitType,
        socialroleid: this.selectedRoleId,
        severity: null
      })
    } else if (type === 'skills') {
      this.beast[type].push({
        skill: '',
        rank: '',
        skillroleid: this.selectedRoleId,
        showAllSkills: true
      })
    } else if (type === 'loot') {
      this.beast[type].push({
        loot: '',
        price: ''
      })
    } else if (type === 'reagents') {
      this.beast[type].push({
        name: '',
        spell: '',
        difficulty: '',
        harvest: ''
      })
    } else if (type === 'locationalvitality') {
      this.beast[type].push({
        location: '',
        vitality: '',
        roleid: this.selectedRoleId
      })
    }
  }

  removeNewSecondaryItem = (type, index, secondType) => {
    let deleted
    if (!secondType) {
      deleted = this.beast[type].splice(index, 1)
    } else {
      deleted = this.beast[type][secondType].splice(index, 1);
    }
    if (type === 'variants') {
      this.beast[type].push({ id: deleted[0].id, variantid: deleted[0].variantid, deleted: true })
    } else if (type === 'conflict') {
      this.beast[type][secondType].push({ id: deleted[0].id, deleted: true })
    } else {
      this.beast[type].push({ id: deleted[0].id, deleted: true })
    }

    if (type === 'combat') {
      this.calculateCombatPoints();
    }
    if (type === 'conflict') {
      this.calculateSocialPoints()
    }
    if (type === 'skill') {
      this.calculateSkillPoints()
    }
  }

  removeChip(type, index) {
    this.beast[type].splice(index, 1)
  }

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
    this.onImageUpload()
  }

  onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    this.beastService.imageUpload(imageForm, this.beast.id).subscribe(res => {
      this.beast.image = res['image']
      this.getImageUrl()
    });
  }

  saveChanges() {
    let id = this.route.snapshot.paramMap.get('id');
    this.beast.combat = this.beast.combat.map(weapon => {

      if (!weapon.deleted) {
        if (weapon.newDR.flat && weapon.newDR.slash) {
          weapon.dr = `${weapon.newDR.slash}/d+${weapon.newDR.flat}`
        } else if (weapon.newDR.flat) {
          weapon.dr = `${weapon.newDR.flat}`
        } else if (weapon.newDR.slash) {
          weapon.dr = `${weapon.newDR.slash}/d`
        } else {
          weapon.dr = null
        }

        if (weapon.newShieldDr.flat && weapon.newShieldDr.slash) {
          weapon.shield_dr = `${weapon.newShieldDr.slash}/d+${weapon.newShieldDr.flat}`
        } else if (weapon.newShieldDr.flat) {
          weapon.shield_dr = `${weapon.newShieldDr.flat}`
        } else if (weapon.newShieldDr.slash) {
          weapon.shield_dr = `${weapon.newShieldDr.slash}/d`
        } else {
          weapon.shield_dr = null
        }

        if (!weapon.deleted) {
          weapon.damage = weapon.newDamage.dice.join(' +')
          let modifier = weapon.newDamage.flat
          if (modifier > 0) {
            modifier = ` +${modifier}`
          } else if (modifier === 0) {
            modifier = ''
          } else if (modifier < 0) {
            modifier = ` ${modifier}`
          }
          weapon.damage += modifier
        }
      }
      return weapon
    })
    this.beast.encounter = this.encounter
    if (this.deletedSpellList) {
      this.beast.deletedSpellList = this.deletedSpellList
    }
    this.calculateCombatPoints()
    this.calculateSocialPoints()
    this.calculateSkillPoints()
    if (+id) {
      this.beastService.updateBeast(this.beast).subscribe(_ => this.router.navigate([`/beast/${id}/gm`]))
    } else {
      this.beastService.addBeast(this.beast).subscribe(result => this.router.navigate([`/beast/${result.id}/gm`]))
    }
  }

  deleteThisBeast() {
    let id = this.route.snapshot.paramMap.get('id');
    this.beastService.deleteBeast(id).subscribe(_ => this.router.navigate(['/catalog']))
  }

  //ENCOUNTER STUFF BECAUSE I KNOW THERE WILL BE A LOT

  addEncounterItem(type, subtype) {
    this.encounter[type][subtype].push({ ...this[type] })
    if (type === 'temperament') {
      this.temperament = {
        temperament: null,
        tooltip: null,
        weight: null
      }
    } else if (type === 'rank') {
      this.unusedRolesForEncounters = this.unusedRolesForEncounters.filter(role => !(this.rank.rank === role))
      this.rank = {
        rank: null,
        weight: null,
        othertypechance: null,
        decayrate: null,
        lair: null
      }
    } else if (type === 'verb') {
      this.verb = {
        verb: null
      }
    } else if (type === 'noun') {
      this.noun = {
        noun: null
      }
    } else if (type === 'signs') {
      this.signs = {
        sign: null,
        weight: null
      }
    }

    let inputs = document.getElementById('random-encounter-tab').getElementsByTagName('input');
    this.resetControllers()
    for (let i = 0; i < inputs.length; ++i) {
      if (inputs[i].className === 'table-input-clearable') {
        inputs[i].value = null
      }
    }
  }

  resetControllers() {
    this.temperamentController.reset()
    this.verbController.reset()
    this.nounController.reset()
    this.signsController.reset()
  }

  addSingleEncounterItem(type) {
    this.encounter[type].push({ ...this[type] })

    if (type === 'numbers') {
      this.numbers = {
        numbers: null,
        miles: null,
        weight: null
      }
    } else if (type === 'groups') {
      this.groups = {
        weight: null,
        label: null,
        weights: []
      }
    }

    let inputs = document.getElementById('random-encounter-tab').getElementsByTagName('input');
    this.resetControllers()
    for (let i = 0; i < inputs.length; ++i) {
      if (inputs[i].className === 'table-input-clearable') {
        inputs[i].value = null
      }
    }
  }

  addEncounterItemFromArray(type, subtype, index) {
    this.encounter[type][index][subtype].push({ ...this[subtype][index] })

    this[subtype][index] = null

    let inputs = document.getElementById('random-encounter-tab').getElementsByTagName('input');
    this.resetControllers()
    for (let i = 0; i < inputs.length; ++i) {
      if (inputs[i].className === 'table-input-clearable') {
        inputs[i].value = null
      }
    }
  }

  captureEncounterAutocomplete(event, type, secondarytype) {
    const { value } = event.option
    if (value.id || value.signid) {
      this[type] = { ...value }
    } else {
      this.captureEncounter(event, type, secondarytype)
    }
  }

  captureEncounter(event, type, secondarytype) {
    const value = event.value ? event.value : event.option.value
    if (secondarytype) {
      this[type][secondarytype] = value
      if (type === 'rank') {
        for (let i = 0; i < this.encounter.rank.allRank.length; i++) {
          let rank = this.encounter.rank.allRank[i]
          if (rank.rank === value) {
            this[type].id = rank.id
            i = this.encounter.rank.allRank.length
          }
        }
      }
    } else {
      this[type] = value
    }
  }

  getDisplayTextTemp = (option) => {
    return this.getDisplayText(option, 'temperament')
  }

  getDisplayTextVerb = (option) => {
    return this.getDisplayText(option, 'verb')
  }

  getDisplayTextNoun = (option) => {
    return this.getDisplayText(option, 'noun')
  }

  getDisplayTextSign = (option) => {
    return this.getDisplayText(option, 'sign')
  }

  getDisplayText = (option, type) => {
    if (option && option[type]) {
      return option[type]
    }
    return ''
  }

  getDisplayTextArtist = (option) => {
    return option.artist
  }

  addOption(event, type) {
    const value = event.target.value
    if (value) {
      let addOption = true
      const allType = `all${this.capitalizeFirstLetter(type)}`
      for (let i = 0; i < this.encounter[type][allType].length; i++) {
        const item = this.encounter[type][allType][i][type]
        if (item === value) {
          addOption = false
        }
      }
      if (addOption) {
        this.captureEncounter({ value }, type, type === 'signs' ? 'sign' : type)
      }
    }
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  captureEncounterSecondary({ value }, type, index, secondaryType) {
    let newSecondaryObject = Object.assign([], this.beast[type])
    newSecondaryObject[index] = { ...newSecondaryObject[index] }
    newSecondaryObject[index][secondaryType] = value
    this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
  }

  captureEncounterInputInt(event, type, subtype) {
    this[type][subtype] = +event.target.value
  }

  captureEncounterInput(event, type, subtype) {
    this[type][subtype] = event.target.value
  }

  captureEncounterInputAtIndex(event, type, subtype, index) {
    if (!this[type][index]) {
      if (type === 'weights') {
        this[type][index] = {
          roleid: null,
          role: null,
          weight: null
        }
      }
    }
    this[type][index][subtype] = event.target.value
  }

  changeEncounterItem(event, type, subtype, index) {
    this.encounter[type][index][subtype] = event.target.value
  }

  changeEncounterItemSubtype(event, type, subtype, index) {
    this.encounter[type][type][index][subtype] = event.target.value
  }

  changeEncounterItemInArray(event, type, subtype, typeindex, subtypeindex, subsubtype) {
    this.encounter[type][typeindex][subtype][subtypeindex][subsubtype] = event.target.value
  }

  removeEncounterItem(index, type, subtype) {
    let deleted = this.encounter[type][subtype].splice(index, 1)[0]
    deleted.deleted = true
    delete deleted.weight;
    if (deleted.id) {
      this.encounter[type][subtype].push(deleted)
    }

    if (deleted.rank === 'None') {
      this.unusedRolesForEncounters.unshift('None')
    } else {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.beast.roles[i].name === deleted.rank) {
          this.unusedRolesForEncounters.push(deleted.rank)
          i = this.beast.roles.length
        }
      }
    }

    if (type === 'temperament' && deleted.id) {
      let cleanVersion = { ...deleted }
      cleanVersion.deleted = false
      this.encounter[type].allTemp.push(cleanVersion)
    }
  }

  removeEncounterItemFromInnerArray(type, typeindex, subtype, subtypeindex) {
    let deleted = this.encounter[type][typeindex][subtype].splice(subtypeindex, 1)[0]
    deleted.deleted = true
    delete deleted.weight;
    if (deleted.id) {
      this.encounter[type][typeindex][subtype].push(deleted)
    }
  }

  removeSingleEncounter = (index, type) => {
    let deleted = this.encounter[type].splice(index, 1)[0]
    deleted.deleted = true
    delete deleted.weight;
    if (deleted.id) {
      this.encounter[type].push(deleted)
    }
  }

  formatRelicAndEnchantedChange(chances) {
    return `${chances.minor}% of Minor, ${chances.middling}% of Middling`
  }

  setArtist(event) {
    let { artist, tooltip, link, id: artistid } = event.option.value
    this.beast.artistInfo.artistid = artistid
    this.beast.artistInfo.artist = artist
    this.beast.artistInfo.tooltip = tooltip
    this.beast.artistInfo.link = link
  }

  captureNewArtist(type, event) {
    if (event.target) {
      this.artist[type] = event.target.value
    } else {
      this.artist[type] = event.value
    }
  }

  addNewArtist() {
    let { artist, tooltip, link } = this.artist
    this.beast.artistInfo.id = null
    this.beast.artistInfo.artistid = null
    this.beast.artistInfo.artist = artist
    this.beast.artistInfo.tooltip = tooltip
    this.beast.artistInfo.link = link

    this.artist = {
      id: null,
      artist: null,
      tooltip: null,
      link: null
    }

    this.viewPanels.forEach(p => p.close());
    this.artistName.nativeElement.value = null
    this.artistLink.nativeElement.value = null
    this.artistTooltip.nativeElement.value = null
  }

  setRole(event) {
    if (event.value) {
      this.selectedRoleId = event.value
      if (this.selectedRoleId) {
        if (this.beast.roleInfo[this.selectedRoleId].role) {
          this.selectedRole = this.combatRolesInfo[this.beast.roleInfo[this.selectedRoleId].role]
        } else {
          this.selectedRole = {}
        }
        if (this.beast.roleInfo[this.selectedRoleId].socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.roleInfo[this.selectedRoleId].socialrole]
        } else {
          this.selectedSocialRole = {}
        }
        if (this.beast.roleInfo[this.selectedRoleId].skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.roleInfo[this.selectedRoleId].skillrole]
        } else {
          this.selectedSkillRole = {}
        }
      } else {
        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        } else {
          this.selectedRole = {}
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        } else {
          this.selectedSocialRole = {}
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        } else {
          this.selectedSkillRole = {}
        }
      }
    } else {
      this.selectedRoleId = null
      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      } else {
        this.selectedRole = {}
      }
      if (this.beast.socialrole) {
        this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
      } else {
        this.selectedSocialRole = {}
      }
      if (this.beast.skillrole) {
        this.selectedSkillRole = this.skillRolesInfo[this.beast.killrole]
      } else {
        this.selectedSkillRole = {}
      }
    }

    this.setStressAndPanic()
    this.setVitalityAndFatigue()
  }

  setRoleType(event) {
    if (this.selectedRoleId) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].role = event.value
          this.beast.roleInfo[this.selectedRoleId].role = event.value
          this.selectedRole = this.combatRolesInfo[event.value]
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.role = event.value
      this.selectedRole = this.combatRolesInfo[event.value]
    }

    if (this.beast.role && !this.beast.vitality) {
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.combatRolesInfo[event.value].vitality)
    }

    this.setStressAndPanic()
    this.setVitalityAndFatigue()
  }

  setSecondaryRoleType(event) {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].secondaryrole = event.value
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].secondaryrole = event.value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.secondaryrole = event.value
    }

    this.setVitalityAndFatigue()
  }

  setSocialSecondaryRoleType(event) {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].socialsecondary = event.value
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].socialsecondary = event.value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.socialsecondary = event.value
    }
  }

  setSocialRoleType(event) {
    if (this.selectedRoleId) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].socialrole = event.value
          this.selectedSocialRole = this.socialRolesInfo[event.value]
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.socialrole = event.value
      this.selectedSocialRole = this.socialRolesInfo[event.value]
    }
  }

  setSkillRoleType(event) {
    if (this.selectedRoleId) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].skillrole = event.value
          this.selectedSkillRole = this.skillRolesInfo[event.value]
          this.beast.roleInfo[this.selectedRoleId].skillrole = event.value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.skillrole = event.value
      this.selectedSkillRole = this.skillRolesInfo[event.value]
    }
  }

  captureNewRole(type, event) {
    if (event.target) {
      this.newRole[type] = event.target.value
    } else {
      this.newRole[type] = event.value
    }
  }

  addNewRole() {
    let isNewRoleFilledOut = (this.newRole.role || this.newRole.socialrole || this.newRole.skillrole)
    let areRolesFilledOutAndAddingFirstRole = (this.beast.role || this.beast.socialrole || this.beast.skillrole) && this.beast.roles.length === 0
    let id = this.makeId()
    if ((isNewRoleFilledOut || areRolesFilledOutAndAddingFirstRole) && this.newRole.name && this.beast.roles.length === 0) {
      this.beast.defaultrole = id

      this.beast.conflict.descriptions.forEach(val => {
        val.socialroleid = id
      })
      this.beast.conflict.convictions.forEach(val => {
        val.socialroleid = id
      })
      this.beast.conflict.devotions.forEach(val => {
        val.socialroleid = id
      })
      this.beast.conflict.flaws.forEach(val => {
        val.socialroleid = id
      })

      this.beast.skills.forEach(val => {
        val.skillroleid = id
      })

      this.beast.combat.forEach(val => {
        val.roleid = id
      })
      this.beast.locationalvitality.forEach(val => {
        val.roleid = id
      })

      this.beast.movement.forEach(val => {
        val.roleid = id
      })

      let rolesToAdd = {
        role: this.newRole.role,
        secondaryrole: this.newRole.secondaryrole,
        socialrole: this.newRole.socialrole,
        socialsecondary: this.newRole.socialsecondary,
        skillrole: this.newRole.skillrole,
      }
      if (areRolesFilledOutAndAddingFirstRole) {
        let { role, secondaryrole, socialrole, socialsecondary, skillrole } = this.beast
        rolesToAdd = {
          role: role ? role : this.newRole.role,
          secondaryrole: secondaryrole ? secondaryrole : this.newRole.secondaryrole,
          socialrole: socialrole ? socialrole : this.newRole.socialrole,
          socialsecondary: socialsecondary ? socialsecondary : this.newRole.socialsecondary,
          skillrole: skillrole ? skillrole : this.newRole.skillrole,
        }
      }

      this.beast.roleInfo[id] = {
        attack: null,
        caution: this.beast.caution,
        combatpoints: this.beast.combatpoints,
        defense: null,
        hash: null,
        name: this.newRole.name,
        panic: this.beast.panic,
        socialpoints: this.beast.socialpoints,
        skillpoints: this.beast.skillpoints,
        stress: this.beast.stress,
        uniqueCombat: true,
        uniqueLocationalVitality: false,
        uniqueMovement: false,
        vitality: this.beast.vitality,
        size: this.beast.size,
        ...rolesToAdd
      }

      this.beast.roles.push({ id, ...this.newRole, ...rolesToAdd })
    } else if ((isNewRoleFilledOut || areRolesFilledOutAndAddingFirstRole) && this.newRole.name) {
      let rolesToAdd = {
        role: this.newRole.role,
        secondaryrole: this.newRole.secondaryrole,
        socialrole: this.newRole.socialrole,
        socialsecondary: this.newRole.socialsecondary,
        skillrole: this.newRole.skillrole,
      }
      if (areRolesFilledOutAndAddingFirstRole) {
        let { role, secondaryrole, socialrole, socialsecondary, skillrole } = this.beast
        rolesToAdd = {
          role: role ? role : this.newRole.role,
          secondaryrole: secondaryrole ? secondaryrole : this.newRole.secondaryrole,
          socialrole: socialrole ? socialrole : this.newRole.socialrole,
          socialsecondary: socialsecondary ? socialsecondary : this.newRole.socialsecondary,
          skillrole: skillrole ? skillrole : this.newRole.skillrole,
        }
      }

      this.beast.roleInfo[id] = {
        attack: null,
        caution: null,
        combatpoints: 0,
        defense: null,
        hash: null,
        name: this.newRole.name,
        panic: null,
        socialpoints: 0,
        skillpoints: 0,
        stress: null,
        uniqueCombat: true,
        uniqueLocationalVitality: false,
        uniqueMovement: false,
        vitality: null,
        size: null,
        ...rolesToAdd
      }

      this.beast.roles.push({ id, ...this.newRole, ...rolesToAdd })
    }

    this.newRole = {
      name: null,
      role: null,
      secondaryrole: null,
      socialrole: null,
      skillrole: null,
      socialsecondary: null
    }
    if (this.beast.roles.length > 0) {
      this.setRole({ value: id })
    }
    this.viewPanels.forEach(p => p.close());
    this.newRoleName.nativeElement.value = null
    this.newCombatRoleSelect.options.forEach((data) => data.deselect())
    this.newSecondaryRoleSelect.options.forEach((data) => data.deselect())
    this.newConfRoleSelect.options.forEach((data) => data.deselect())
    this.newSkillRoleSelect.options.forEach((data) => data.deselect())
    this.newSecondaryConfRoleSelect.options.forEach((data) => data.deselect())
  }

  makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  copyWeaponSquareUnbound(square) {
    let newDR = { ...square.newDR }
    let newDamage = { ...square.newDamage }
    let newShieldDr = { ...square.newShieldDr }
    let weaponInfo = { ...square.weaponInfo }

    let weaponCopy = { ...square, newDR, newDamage, newShieldDr, weaponInfo }
    delete weaponCopy.id

    this.beast.combat.push(weaponCopy)
    this.calculateCombatPoints()
  }
  copyWeaponSquare = this.copyWeaponSquareUnbound.bind(this);

  // SPELL STUFF
  checkWeirdshapeType = (type, e) => {
    this.beast.casting[type] = e.checked
  }

  changeDefaultType = (type) => {
    this.beast.casting.defaulttype = type
  }

  addToAllRoles = (index, e) => {
    this.beast.spells[index].allroles = e.checked
  }

  captureSpellDie = (e) => {
    this.beast.casting.spellnumberdie = e.target.value
  }

  captureSpellSelect = (e, type, index) => {
    this.beast.spells[index][type] = e.value
  }

  captureSpellInput = (e, index, type) => {
    this.beast.spells[index][type] = e.target.value
  }

  captureSpellHTML = (e, index) => {
    this.beast.spells[index].effect = e.html
  }

  addNewSpell = () => {
    this.beast.spells.push({
      id: this.makeId(),
      beastid: null,
      name: null,
      origin: null,
      shape: null,
      range: null,
      interval: null,
      effect: null,
      allroles: null,
      roleid: this.selectedRoleId
    })
  }

  deleteSpell = (index) => {
    let deletedSpell = this.beast.spells.splice(index, 1)
    if (!this.deletedSpellList) {
      this.deletedSpellList = []
    }
    if (deletedSpell[0].beastid) {
      this.deletedSpellList.push(deletedSpell[0].id)
    }
  }

  calculateCombatPoints = () => {
    //Base
    let combatpoints = 0

    let vitalityToUse = this.beast.vitality
    if (!vitalityToUse && this.beast.role) {
      vitalityToUse = roles.combatRoles.primary[this.beast.role].vitality
      if (this.beast.secondaryrole && this.beast.secondaryrole === 'Fodder') {
        vitalityToUse = `(${vitalityToUse})/2`
      }
    } else if (!vitalityToUse) {
      vitalityToUse = 0
    }
    vitalityToUse = this.calculatorService.calculateAverageOfDice(vitalityToUse)
    combatpoints += Math.ceil(vitalityToUse / 10)

    if (this.beast.stress) {
      combatpoints += Math.ceil(this.beast.stress / 5)
    }

    if (this.beast.panic === 1) {
      combatpoints -= 2
    } else if (this.beast.panic === 2) {
      combatpoints -= 2
    } else if (this.beast.panic === 3) {
      combatpoints -= 2
    } else if (this.beast.panic === 4) {
      combatpoints -= 2
    } else if (this.beast.panic === 7) {
      combatpoints += 2
    }

    this.beast.skills.forEach(skill => {
      if (!skill.skillroleid && this.combatSkills.includes(skill.skill)) {
        combatpoints += +skill.rank
      }
    })

    let fatigueAddedIn = false;

    this.beast.combat.forEach(weapon => {
      if (weapon.roleid === null) {
        let { def, newDR, parry, newShieldDr, newDamage, atk, rangedDamage, spd, measure, ranges, weapontype, fatigue, selectedweapon, damageskill, weaponInfo, damagetype } = weapon

        if (!fatigueAddedIn) {
          if (fatigue === 'N') {
            combatpoints += 4
          } else if (fatigue === 'W') {
            combatpoints -= 4
          } else if (fatigue === 'B') {
            combatpoints -= 8
          } else if (fatigue === 'H') {
            combatpoints -= 12
          } else if (fatigue === 'A') {
            combatpoints -= 16
          }
          fatigueAddedIn = true;
        }
        // combatpoints += evaluateDefense(def)
        combatpoints += newDR.flat
        combatpoints += (newDR.slash * 4)
        combatpoints += ((parry + newShieldDr.flat) / 2)
        combatpoints += (newShieldDr.slash * 2)
        combatpoints += (spd * 2) * -1
        combatpoints += (measure * 2)
        combatpoints += atk
        combatpoints += newDamage.flat
        let damageType = selectedweapon ? weaponInfo.type : damagetype
        if (damageType === 'S') {
          combatpoints += Math.ceil(damageskill / 2)
        } else if (damageType === 'P') {
          combatpoints += Math.ceil(damageskill / 4) * 2
        } else {
          combatpoints += damageskill
        }

        newDamage.dice.forEach(damage => {
          let pointValue
          let damageArray = damage.split('d')
          let dice = damageArray[1]
          if (dice.includes('!')) {
            dice = dice.slice(0, -1)
          }
          let number = damageArray[0]
          if (number === '') {
            number = 1
          }
          if (dice == '3' || dice == '4') {
            pointValue = +number
          } else if (dice == '6' || dice == '8') {
            pointValue = (+number * 2)
          } else if (dice == '10') {
            pointValue = (+number * 3)
          } else if (dice == '12') {
            pointValue = (+number * 4)
          } else if (dice == '20') {
            pointValue = (+number * 6)
          }
          combatpoints += pointValue
        })
        if (weapontype === 'r') {
          combatpoints += Math.ceil(ranges.increment / 10)
        }
      }
    })

    // this.beast.combatpoints = combatpoints

    //Roles
    this.beast.roles.forEach(role => {
      let combatpoints = 0
      let vitalityToUse = role.vitality

      if (!vitalityToUse && role.role) {
        vitalityToUse = roles.combatRoles.primary[role.role].vitality
        if (role.secondaryrole && role.secondaryrole === 'Fodder') {
          vitalityToUse = `(${vitalityToUse})/2`
        }
      } else if (!vitalityToUse) {
        vitalityToUse = 0
      }
      vitalityToUse = this.calculatorService.calculateAverageOfDice(vitalityToUse)

      combatpoints += Math.ceil(vitalityToUse / 10)
      if (role.stress) {
        combatpoints += Math.ceil(role.stress / 5)
      } else {
        combatpoints += Math.ceil(this.beast.stress / 5)
      }

      this.beast.skills.forEach(skill => {
        if (skill.skillroleid === role.id && this.combatSkills.includes(skill.skill)) {
          combatpoints += +skill.rank
        }
      })

      let panic = role.panic ? role.panic : this.beast.panic
      if (panic === 1) {
        combatpoints -= 8
      } else if (panic === 2) {
        combatpoints -= 6
      } else if (panic === 3) {
        combatpoints -= 4
      } else if (panic === 4) {
        combatpoints -= 2
      } else if (panic === 7) {
        combatpoints += 2
      }

      let weapons = this.beast.combat.filter(weapon => weapon.roleid === role.id)

      let fatigueAddedIn = false;

      if (weapons.length > 0) {
        weapons.forEach(weapon => {
          if (weapon.roleid === null) {
            let { def, newDR, parry, newShieldDr, newDamage, atk, spd, measure, ranges, weapontype, fatigue } = weapon

            if (!fatigueAddedIn) {
              if (fatigue === 'N') {
                combatpoints += 4
              } else if (fatigue === 'W') {
                combatpoints -= 4
              } else if (fatigue === 'B') {
                combatpoints -= 8
              } else if (fatigue === 'H') {
                combatpoints -= 12
              } else if (fatigue === 'A') {
                combatpoints -= 16
              }
              fatigueAddedIn = true
            }
            combatpoints += eval(def)
            combatpoints += newDR.flat
            combatpoints += (newDR.slash * 4)
            combatpoints += ((parry + newShieldDr.flat) / 2)
            combatpoints += (newShieldDr.slash * 2)
            combatpoints += (spd * 2) * -2
            combatpoints += (measure * 2)
            combatpoints += atk
            combatpoints += newDamage.flat
            newDamage.dice.forEach(damage => {
              let pointValue
              let damageArray = damage.split('d')
              let dice = damageArray[1]
              if (dice.includes('!')) {
                dice = dice.slice(0, -1)
              }
              let number = damageArray[0]
              if (number === '') {
                number = 1
              }
              if (dice == '3' || dice == '4') {
                pointValue = +number
              } else if (dice == '6' || dice == '8') {
                pointValue = (+number * 2)
              } else if (dice == '10') {
                pointValue = (+number * 3)
              } else if (dice == '12') {
                pointValue = (+number * 4)
              } else if (dice == '20') {
                pointValue = (+number * 6)
              }
              combatpoints += pointValue
            })
            if (weapontype === 'r') {
              combatpoints += Math.ceil(ranges.increment / 10)
            }
          }
        })
      } else {
        this.beast.combat.forEach(weapon => {
          if (weapon.roleid === null) {
            let { def, newDR, parry, newShieldDr, newDamage, atk, spd, measure, ranges, weapontype, fatigue } = weapon

            if (!fatigueAddedIn) {
              if (fatigue === 'N') {
                combatpoints += 4
              } else if (fatigue === 'W') {
                combatpoints -= 4
              } else if (fatigue === 'B') {
                combatpoints -= 8
              } else if (fatigue === 'H') {
                combatpoints -= 12
              } else if (fatigue === 'A') {
                combatpoints -= 16
              }
              fatigueAddedIn = true
            }
            // combatpoints += evaluateDefense(def)
            combatpoints += newDR.flat
            combatpoints += (newDR.slash * 4)
            combatpoints += ((parry + newShieldDr.flat) / 2)
            combatpoints += (newShieldDr.slash * 2)
            combatpoints += (spd * 2) * -1
            combatpoints += (measure * 2)
            combatpoints += atk
            combatpoints += newDamage.flat
            newDamage.dice.forEach(damage => {
              let pointValue
              let damageArray = damage.split('d')
              let dice = damageArray[1]
              if (dice.includes('!')) {
                dice = dice.slice(0, -1)
              }
              let number = damageArray[0]
              if (number === '') {
                number = 1
              }
              if (dice == '3' || dice == '4') {
                pointValue = +number
              } else if (dice == '6' || dice == '8') {
                pointValue = (+number * 2)
              } else if (dice == '10') {
                pointValue = (+number * 3)
              } else if (dice == '12') {
                pointValue = (+number * 4)
              } else if (dice == '20') {
                pointValue = (+number * 6)
              }
              combatpoints += pointValue
            })
            if (weapontype === 'r') {
              combatpoints += Math.ceil(ranges.increment / 10)
            }
          }
        })
      }

      // role.combatpoints = combatpoints
      // this.beast.roleInfo[role.id].combatpoints = combatpoints
    })
  }

  calculateSocialPoints = () => {
    let socialpoints = 0

    socialpoints += Math.ceil(this.beast.stress / 5)

    socialpoints += this.getPanicValue(this.beast.panic)

    this.beast.conflict.devotions.forEach(trait => {
      if ((!trait.socialroleid || trait.allroles) && !trait.deleted) {
        socialpoints += +trait.value
      }
    })
    this.beast.conflict.flaws.forEach(trait => {
      if ((!trait.socialroleid || trait.allroles) && !trait.deleted) {
        socialpoints -= 2
      }
    })
    this.beast.conflict.convictions.forEach(trait => {
      if ((!trait.socialroleid || trait.allroles) && !trait.deleted) {
        socialpoints += +trait.value
      }
    })
    this.beast.conflict.descriptions.forEach(trait => {
      if ((!trait.socialroleid || trait.allroles) && !trait.deleted) {
        socialpoints += +trait.value
      }
    })

    this.beast.skills.forEach(skill => {
      if ((!skill.skillroleid || skill.allroles) && this.socialSkills.includes(skill.skill) && !skill.deleted) {
        socialpoints += +skill.rank
      }
    })

    this.beast.socialpoints = socialpoints

    this.beast.roles.forEach(role => {
      let socialpoints = 0

      let panic = role.panic ? role.panic : this.beast.panic
      socialpoints += this.getPanicValue(panic)

      this.beast.conflict.devotions.forEach(trait => {
        if ((trait.socialroleid === role.id || trait.allroles) && !trait.deleted) {
          socialpoints += +trait.value
        }
      })
      this.beast.conflict.flaws.forEach(trait => {
        if ((trait.socialroleid === role.id || trait.allroles) && !trait.deleted) {
          socialpoints -= +trait.value
        }
      })
      this.beast.conflict.convictions.forEach(trait => {
        if ((trait.socialroleid === role.id || trait.allroles) && !trait.deleted) {
          socialpoints += +trait.value
        }
      })
      this.beast.conflict.descriptions.forEach(trait => {
        if ((trait.socialroleid === role.id || trait.allroles) && !trait.deleted) {
          socialpoints += +trait.value
        }
      })

      this.beast.skills.forEach(skill => {
        if ((skill.skillroleid === role.id || skill.allroles) && this.socialSkills.includes(skill.skill) && !skill.deleted) {
          socialpoints += +skill.rank
        }
      })

      role.socialpoints = socialpoints
      this.beast.roleInfo[role.id].socialpoints = socialpoints
    })
  }

  calculateSkillPoints = () => {
    let skillpoints = 0

    skillpoints += Math.ceil(this.beast.stress / 5)

    skillpoints += this.getPanicValue(this.beast.panic)

    this.beast.skills.forEach(skill => {
      if ((!skill.skillroleid || skill.allroles) && !skill.deleted) {
        skillpoints += +skill.rank
      }
    })

    this.beast.skillpoints = skillpoints

    this.beast.roles.forEach(role => {
      let skillpoints = 0

      let panic = role.panic ? role.panic : this.beast.panic
      skillpoints += this.getPanicValue(panic)

      this.beast.skills.forEach(skill => {
        if ((skill.skillroleid === role.id || skill.allroles) && !skill.deleted) {
          skillpoints += +skill.rank
        }
      })

      role.skillpoints = skillpoints
      this.beast.roleInfo[role.id].skillpoints = skillpoints
    })
  }

  setStressAndPanic = () => {
    const baseRoleInfo = roles.combatRoles.primary[this.beast.roleInfo[this.selectedRoleId].role].meleeCombatStats
    this.mental.stress = this.combatStatsService.getModifiedStats('mental', this.beast.roleInfo[this.selectedRoleId], baseRoleInfo, this.beast.roleInfo[this.selectedRoleId].combatpoints)

    let panic = this.combatStatsService.getModifiedStats('panic', this.beast.roleInfo[this.selectedRoleId], baseRoleInfo, this.beast.roleInfo[this.selectedRoleId].combatpoints)
    if (panic > 1) {
      panic = 1
    }
    this.mental.panic = Math.floor(panic * this.mental.stress)
  }

  setVitalityAndFatigue = () => {
    const baseRoleInfo = roles.combatRoles.primary[this.beast.roleInfo[this.selectedRoleId].role].meleeCombatStats
    this.physical.largeweapons = this.combatStatsService.getModifiedStats('largeweapons', this.beast.roleInfo[this.selectedRoleId], baseRoleInfo, this.beast.roleInfo[this.selectedRoleId].combatpoints)

    if (this.beast.roleInfo[this.selectedRoleId].secondaryrole) {
      if (this.beast.roleInfo[this.selectedRoleId].secondaryrole === 'Fodder') {
        this.physical.largeweapons = Math.floor(this.physical.largeweapons / 2)
      } else if (this.beast.roleInfo[this.selectedRoleId].secondaryrole === 'Solo') {
        this.physical.largeweapons *= 3
      }
    } 

    let fatigue = this.combatStatsService.getModifiedStats('fatigue', this.beast.roleInfo[this.selectedRoleId], baseRoleInfo, this.beast.roleInfo[this.selectedRoleId].combatpoints)
    if (fatigue > 1) {
      fatigue = 1
    }
    this.physical.fatigue = Math.floor(fatigue * this.physical.largeweapons)

    this.deteremineVitalityDice()
    this.setCaution()
  }

  setCaution = () => {
    const baseRoleInfo = roles.combatRoles.primary[this.beast.roleInfo[this.selectedRoleId].role].meleeCombatStats
    let caution = this.combatStatsService.getModifiedStats('caution', this.beast.roleInfo[this.selectedRoleId], baseRoleInfo, this.beast.roleInfo[this.selectedRoleId].combatpoints)
    if (caution > 1) {
      caution = 1
    }
    this.mental.caution = Math.floor((this.mental.stress + this.physical.largeweapons) * caution)
  }

  public sizeDictionary = {
    Fine: 1,
    Diminutive: 5,
    Tiny: 5,
    Small: 10,
    Medium: 15,
    Large: 20,
    Huge: 35,
    Giant: 55,
    Enormous: 90,
    Colossal: 145
  }

  deteremineVitalityDice = () => {
    let size = this.beast.roleInfo[this.selectedRoleId].size
    if (!size && this.beast.size) {
      size = this.beast.size
    } else {
      size = 'Medium'
    }

    let sizeMod
    if (this.beast.roleInfo[this.selectedRoleId].knockback) {
      sizeMod = this.beast.roleInfo[this.selectedRoleId].knockback
    } else {
      sizeMod = this.sizeDictionary[size]
    }
    if (this.physical.largeweapons - sizeMod > 0) {
      const remainder = this.physical.largeweapons - sizeMod
      if (remainder % 10 === 0) {
        if (remainder / 10 > 1) {
          this.physical.diceString = `(d20 * ${remainder / 10}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d20 + ${sizeMod}`
        }
      } else if (remainder % 6 === 0) {
        if (remainder / 6 > 1) {
          this.physical.diceString = `(d12 * ${remainder / 6}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d12 + ${sizeMod}`
        }
      } else if (remainder % 5 === 0) {
        if (remainder / 5 > 1) {
          this.physical.diceString = `(d10 * ${remainder / 5}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d10 + ${sizeMod}`
        }
      } else if (remainder % 4 === 0) {
        if (remainder / 4 > 1) {
          this.physical.diceString = `(d8 * ${remainder / 4}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d8 + ${sizeMod}`
        }
      } else if (remainder % 3 === 0) {
        if (remainder / 3 > 1) {
          this.physical.diceString = `(d6 * ${remainder / 3}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d6 + ${sizeMod}`
        }
      } else if (remainder % 2 === 0) {
        if (remainder / 2 > 1) {
          this.physical.diceString = `(d4 * ${remainder / 2}) + ${sizeMod}`
        } else {
          this.physical.diceString = `d4 + ${sizeMod}`
        }
      } else {
        this.physical.diceString = this.physical.largeweapons
      }
    } else {
      this.physical.diceString = this.physical.largeweapons
    }
  }

  convertFatigue() {
    if (isNaN(this.averageVitality)) {
      return ' '
    }

    let percentage: any = .00;
    switch (this.displayFatigue) {
      case 'A':
        percentage = 'A'
        break;
      case 'H':
        percentage = 1
        break;
      case 'B':
        percentage = .25
        break;
      case 'W':
        percentage = .5
        break;
      case 'C':
        percentage = .75
        break;
      case 'N':
        percentage = 'N'
        break;
      default:
        percentage = .75
    }

    if (percentage < 1 && !isNaN(percentage)) {
      this.fatigueAsVitality = `Fatigued at ${(this.averageVitality * percentage).toFixed(0)} damage`
    } else if (!isNaN(percentage)) {
      this.fatigueAsVitality = `Fatigued at ${percentage} damage`
    } else if (percentage === 'A') {
      this.fatigueAsVitality = "This Monster is Always Fatigued"
    } else if (percentage === 'N') {
      this.fatigueAsVitality = "This Monster is Never Fatigued"
    } else {
      this.fatigueAsVitality = 'Something went wrong calculating when this monster is fatigued.'
    }
  }

  getFatigueValue = (fatigue) => {
    switch (fatigue) {
      case 'A':
        return -16;
      case 'H':
        return -12;
      case 'B':
        return -8;
      case 'W':
        return -4;
      case 'C':
        return 0;
      case 'N':
        return 4;
    }
  }

  captureFolklore(type, index, event) {
    this.beast.folklore[index][type] = event.target.value
  }

  deleteFolkloreEntry(index) {
    this.beast.folklore.splice(index, 1)
  }

  captureNewFolklore(type, event) {
    this.folklore[type] = event.target.value

    if (this.folklore.belief && this.folklore.truth) {
      this.beast.folklore.push(this.folklore)
      event.target.value = null
      this.folklore = {
        belief: null,
        truth: null
      }
    }
  }

  checkStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }
    if (this.beast.roleInfo[this.selectedRoleId][stat] === value) {
      event.source._checked = false
      this.beast.roleInfo[this.selectedRoleId][stat] = null
    } else if (this.selectedRole[stat] === value || (value === 'none' && !this.selectedRole[stat])) {
      event.source._checked = true
      this.beast.roleInfo[this.selectedRoleId][stat] = null
    } else {
      this.beast.roleInfo[this.selectedRoleId][stat] = value
    }

    this.setStressAndPanic()
    this.setVitalityAndFatigue()
  }

  checkMovementStat = (stat, value, event, index) => {
    if (!value) {
      event.source._checked = false
    }
    if (this.beast.movement[index][stat] === value) {
      event.source._checked = false
      this.beast.movement[index][stat] = null
    } else if (this.selectedRole.meleeCombatStats.movement === value || (value === 'none' && !this.selectedRole.meleeCombatStats.movement)) {
      event.source._checked = true
      this.beast.movement[index][stat] = null
    } else {
      this.beast.movement[index][stat] = value
    }

    this.beast.movement[index].movementSpeeds = this.calculateMovementSpeed(index, this.selectedRole.meleeCombatStats, this.beast.roleInfo[this.selectedRoleId].combatpoints)
  }

  calculateMovementSpeed = (index, roleInfo, combatpoints) => {
    let movementSpeeds = {
      crawlspeed: 0,
      walkspeed: 0,
      jogspeed: 0,
      runspeed: 0,
      sprintspeed: 0
    }

    movementSpeeds.crawlspeed = this.combatStatsService.getMovementStats(this.beast.movement[index].crawlstrength, roleInfo, combatpoints)
    movementSpeeds.walkspeed = this.combatStatsService.getMovementStats(this.beast.movement[index].walkstrength, roleInfo, combatpoints) + movementSpeeds.crawlspeed
    movementSpeeds.jogspeed = this.combatStatsService.getMovementStats(this.beast.movement[index].jogstrength, roleInfo, combatpoints) * 2 + movementSpeeds.walkspeed
    movementSpeeds.runspeed = this.combatStatsService.getMovementStats(this.beast.movement[index].runstrength, roleInfo, combatpoints) * 2 + movementSpeeds.jogspeed
    movementSpeeds.sprintspeed = this.combatStatsService.getMovementStats(this.beast.movement[index].sprintstrength, roleInfo, combatpoints) * 2 + movementSpeeds.runspeed
    return movementSpeeds
  }

  getImageUrl() {
    this.imageUrl = this.imageBase + this.beast.id + '?t=' + new Date().getTime()
  }

  deleteRole() {
    this.beast.conflict.devotions.forEach((subcat, index) => {
      if (this.selectedRoleId === subcat.socialroleid) {
        this.removeNewSecondaryItem('conflict', index, 'devotions')
      }
    })
    this.beast.conflict.convictions.forEach((subcat, index) => {
      if (this.selectedRoleId === subcat.socialroleid) {
        this.removeNewSecondaryItem('conflict', index, 'convictions')
      }
    })
    this.beast.conflict.descriptions.forEach((subcat, index) => {
      if (this.selectedRoleId === subcat.socialroleid) {
        this.removeNewSecondaryItem('conflict', index, 'descriptions')
      }
    })
    this.beast.conflict.flaws.forEach((subcat, index) => {
      if (this.selectedRoleId === subcat.socialroleid) {
        this.removeNewSecondaryItem('conflict', index, 'flaws')
      }
    })

    this.beast.skills.forEach((cat, index) => {
      if (this.selectedRoleId === cat.skillroleid) {
        this.removeNewSecondaryItem('skills', index, null)
      }
    })

    this.beast.combat.forEach((cat, index) => {
      if (this.selectedRoleId === cat.roleid) {
        this.removeNewSecondaryItem('combat', index, null)
      }
    })

    this.beast.movement.forEach((cat, index) => {
      if (this.selectedRoleId === cat.roleid) {
        this.removeNewSecondaryItem('movement', index, null)
      }
    })

    let oldRoleId = this.selectedRoleId
    this.beast.roles = this.beast.roles.filter(role => role.id !== oldRoleId)
    if (this.beast.defaultrole === this.selectedRoleId) {
      this.beast.defaultrole = null
    }
    this.setDefaultRole()
    this.setRole({ value: this.beast.defaultrole })
  }

  setDefaultRole = () => {
    if (!this.beast.defaultrole && this.beast.roles.length > 0) {
      this.beast.defaultrole = this.beast.roles[0].id
    } else if (this.beast.roles.length === 0) {
      this.beast.defaultrole = null
    }
    if (this.beast.defaultrole) {
      this.setRole({ value: this.beast.defaultrole })
    }
  }

  updateDefaultRole = () => {
    this.beast.defaultrole = this.selectedRoleId
  }

  updateDefaultSize = () => {
    this.beast.size = this.beast.roleInfo[this.selectedRoleId].size
  }

  displayName(selectedRoleId) {
    let roleInfo = this.beast.roleInfo[selectedRoleId]
      , combatrole = roleInfo.role
      , secondarycombat = roleInfo.secondaryrole
      , socialrole = roleInfo.socialrole
      , socialsecondary = roleInfo.socialsecondary
      , skillrole = roleInfo.skillrole
    let nameString = ''
    let roles = false

    if (combatrole || socialrole || skillrole) {
      nameString += ' ['
      roles = true
    }
    if (combatrole) {
      nameString += `<img src="./assets/combaticon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${combatrole}`
      if (secondarycombat) {
        nameString += ` (${secondarycombat})`
      }
    }
    if (socialrole) {
      if (nameString.length > 3) {
        nameString += '/'
      }
      nameString += `<img src="./assets/socialicon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${socialrole}`
      if (socialsecondary) {
        nameString += ` (${socialsecondary})`
      }
    }
    if (skillrole) {
      if (nameString.length > 3) {
        nameString += '/'
      }
      nameString += `<img src="./assets/skillicon.svg" alt="combat role type" width="17" height="17" class="catalogicon">${skillrole}`
    }

    if (roles) {
      nameString += ']'
    }

    return nameString
  }
}
