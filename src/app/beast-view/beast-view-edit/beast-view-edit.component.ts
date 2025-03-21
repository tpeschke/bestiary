import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import variables from '../../../local.js'
import lootTables from "../loot-tables.js"
import roles from '../roles.js'
import { MatAutocomplete, MatExpansionPanel, MatSelect } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, switchMap, debounceTime } from 'rxjs/operators';
import { CalculatorService } from 'src/app/util/services/calculator.service';
import { DisplayServiceService } from 'src/app/util/services/displayService.service';
import ratings from '../../util/ratings'

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['./beast-view-edit.component.css', '../beast-view.component.css']
})
export class BeastViewEditComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('newRoleName') newRoleName;
  @ViewChild('artistName') artistName;
  @ViewChild('artistLink') artistLink;
  @ViewChild('locationLocation') locationLocation;
  @ViewChild('locationLink') locationLink;
  @ViewChild('artistTooltip') artistTooltip;
  @ViewChild('roleSelect') roleSelect;
  @ViewChild('newCombatRoleSelect') newCombatRoleSelect: MatSelect;
  @ViewChild('newSecondaryRoleSelect') newSecondaryRoleSelect: MatSelect;
  @ViewChild('newConfRoleSelect') newConfRoleSelect: MatSelect;
  @ViewChild('newSkillRoleSelect') newSkillRoleSelect: MatSelect;
  @ViewChild('newSecondaryConfRoleSelect') newSecondaryConfRoleSelect: MatSelect;
  @ViewChild('verbAutocomplete') verbAutocomplete: MatAutocomplete;
  @ViewChild('nounAutocomplete') nounAutocomplete: MatAutocomplete;
  @ViewChild('signAutocomplete') signAutocomplete: MatAutocomplete;
  mainImageObj: File;
  tokenImageObj: File

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    private displayService: DisplayServiceService
  ) { }

  objectKeys = Object.keys;

  public beast = null;
  public encounter = null;
  public loggedIn = this.beastService.loggedIn || false;
  public types = null;
  public climate = null;
  public imageBase = variables.imageBase;
  public uploader: any;
  public lootTables = lootTables;
  public checkForDeleteRole = false
  public checkForDelete = false

  public imageController: FormControl;
  public imagesFiltered: Observable<any[]>;
  public hasNoBaseImage = false;

  public variantController: FormControl;
  public variantsFiltered: Observable<any[]>;

  public obstacleController: FormControl;
  public obstaclesFiltered: Observable<any[]>;

  public challengeController: FormControl;
  public challengesFiltered: Observable<any[]>;

  public mental = {
    stress: null,
    panic: null,
  }
  public physical = {
    largeweapons: null,
    fatigue: null,
    diceString: '',
    intiative: null
  }

  public selectedRoleId = null;
  public filteredRoles = [];
  public selectedRole: any = {}
  public selectedSocialRole = {}
  public selectedSkillRole = {}
  public imageUrl = null;
  public previewUrl = null
  public tokenExists: Boolean = false;
  public roleTokenExists: Boolean = false
  public unusedRolesForEncounters = []
  public allBurdens;
  public allSpells;
  public newRole = {
    name: null,
    role: null,
    secondaryrole: null,
    socialrole: null,
    skillrole: null,
    socialsecondary: null,
    skillsecondary: null
  };
  public deletedSpellList = null;


  public ratingsObject = ratings.ratingsObject
  public ratingsArray = ratings.ratingsArray

  public mentalStats = [
    {
      label: 'Mental',
      stat: 'mental',
      tooltip: 'Nerve'
    },
    {
      label: 'Panic',
      stat: 'panic',
    }
  ]

  public templateIds = [503, 504, 494, 505, 492, 508, 502, 491, 498, 512, 511, 507, 513, 496, 499, 501, 500, 497, 493, 509, 515, 514, 510]

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

  public location = {
    id: null,
    location: null,
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

  public scenario = null

  public weights = []

  combatRolesInfo = roles.combatRoles.primary;
  combatRolesSecondaryInfo = roles.combatRoles.secondary
  socialRolesInfo = roles.socialRoles.primary;
  socialRolesSecondaryInfo = roles.socialRoles.secondary
  skillRolesInfo = roles.skillRoles.primary;
  skillRolesSecondaryInfo = roles.skillRoles.secondary

  public combatSkills = ['Endurance', 'Jumping', 'Climbing', 'Move Silently', 'Hiding', 'Swimming', 'Tumbling', 'Escape Artist', 'Warfare', 'Athletics Skill Suite', 'Strategy Skill Suite']
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

  public artistRoleController = new FormControl('');
  public artistRoleFiltered: Observable<any[]>;

  public locationController = new FormControl('');
  public locationFiltered: Observable<any[]>;

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

        this.beast.combatStatArray = this.beast.combatStatArray.map(combat => {
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

        this.beast.conflict.burdens = this.beast.conflict.burdens.map(socialObject => {
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

        this.beast.movement = this.beast.movement.map((movementObject) => {
          if (movementObject.roleid) {
            movementObject.roleid = roleIdsDictionary[movementObject.roleid]
          }
          movementObject.movementSpeeds = this.calculateMovementSpeed()
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

        this.beast.carriedloot.items = this.beast.carriedloot.items.map(item => {
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

        this.beast.climates.beast = this.beast.climates.beast.map(climate => {
          delete climate.beastid
          delete climate.uniqueid
          return climate
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
          this.encounter.groups = this.encounter.groups.map(group => {
            delete group.id
            delete group.beastid
            group.weights = group.weights.map(weight => {
              delete weight.id
              delete weight.beastid
              return weight
            })
            return group
          })
          this.encounter.noun.noun = this.encounter.noun.noun.map(noun => {
            delete noun.id
            delete noun.beastid
            return noun
          })
          this.encounter.numbers = this.encounter.numbers.map(number => {
            delete number.id
            delete number.beastid
            return number
          })
          this.encounter.signs.signs = this.encounter.signs.signs.map(sign => {
            delete sign.id
            delete sign.signid
            delete sign.beastid
            return sign
          })
          this.encounter.temperament.temperament = this.encounter.temperament.temperament.map(temp => {
            delete temp.id
            delete temp.temperamentid
            delete temp.beastid
            return temp
          })
          this.encounter.verb.verb = this.encounter.verb.verb.map(verb => {
            delete verb.id
            delete verb.beastid
            return verb
          })
          this.bootUpEncounterAutoComplete()
        })
      } else if (beast) {
        this.beast = beast
        this.setRole({ value: this.beast.defaultrole })

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

        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        }

        this.beast.movement = this.beast.movement.map((val, i) => {
          val.movementSpeeds = this.calculateMovementSpeed()
          return val
        })
        this.beastService.getEditEncounter(this.beast.id).subscribe(encounter => {
          this.encounter = encounter
          this.bootUpEncounterAutoComplete()
        })
        this.getImageUrl()
        this.seeIfTokenExists()
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
          panic: null,
          stress: 0,
          combatpoints: 0,
          skillpoints: 0,
          socialpoints: 0,
          combat: [],
          combatStatArray: [],
          conflict: { descriptions: [], convictions: [], devotions: [], burdens: [], flaws: [] },
          skills: [],
          movement: [],
          types: [],
          climates: {
            beast: [],
            allclimates: []
          },
          variants: [],
          loot: [],
          lootnotes: '',
          reagents: [],
          locationalvitality: [],
          lairloot: {
            items: {}
          },
          carriedloot: {
            items: {}
          },
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
          rollundertrauma: 10,
          challenges: [],
          obstacles: [],
          locations: [],
          artistInfo: {},
          plural: null,
          rarity: 10,
          tables: {
            appearance: [],
            habitat: [],
            attack: [],
            defense: []
          },
          scenarios: []
        }
      }

      if (this.beast.climates.allclimates.length === 0) {
        this.beastService.getAllClimates().subscribe((results: any) => {
          this.beast.climates.allclimates = results
        })
      }

      this.beastService.getSpellsForPleroma().subscribe(result => {
        this.allSpells = result
      })

      this.beastService.getBurdens().subscribe((results: any) => {
        delete results.ibTables
        let newAllBurdens = []
        for (const key in results) {
          newAllBurdens.push({
            label: key.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            burdens: results[key].map(burden => { return { trait: burden.ib } })
          })
        }
        this.allBurdens = newAllBurdens
      })

      this.bootUpAutoCompletes()

      this.setDefaultRole()
      this.setVitalityAndStress()

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })

      this.bootUpAutoComplete()
    })
  }

  bootUpAutoComplete() {
    this.variantController = new FormControl('')
    this.variantsFiltered = this.variantController.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(val => {
          return this.filterAsync(val || '', 'searchName')
        })
      );

    this.imageController = new FormControl('')
    this.imagesFiltered = this.imageController.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(val => {
          return this.filterAsync(val || '', 'searchName')
        })
      );

    this.obstacleController = new FormControl('')
    this.obstaclesFiltered = this.obstacleController.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(val => {
          return this.filterAsync(val || '', 'searchObstacle')
        })
      );

    this.challengeController = new FormControl('')
    this.challengesFiltered = this.challengeController.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(val => {
          return this.filterAsync(val || '', 'searchChallenge')
        })
      );
  }

  filterAsync(val: string, searchMethod: string): Observable<any[]> {
    if (val !== '') {
      return this.beastService[searchMethod](val)
        .pipe(
          map((response: any[]) => response)
        )
    } else {
      return new Observable((subscriber) => { subscriber.complete() })
    }
  }

  captureImage = (event) => {
    if (!isNaN(+event.target.value)) {
      this.beast.imagesource = event.target.value
      this.getImageUrl()
      if (this.beast.imagesource) {
        this.beastService.getArtist(this.beast.imagesource).subscribe(result => {
          this.setArtist({ option: { value: result[0] } })
        })
      }
    }
  }

  captureVariant = (event) => {
    if (event.option.value.id && event.option.value.name) {
      this.beast.variants.push({ variantid: event.option.value.id, name: event.option.value.name })
    }
  }


  getDisplayVariant = (option) => {
    return option.name
  }

  _filterGroup = (value, groups, type) => {
    if (value) {
      return groups
        .map(group => ({ label: group.label, burdens: this._filter(value, group.burdens, type) }))
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

    this.artistRoleFiltered = this.artistRoleController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.beast.artistInfo.allartists, 'artist')),
    );
    if (this.selectedRoleId) {
      const indexToChange = this.beast.artistInfo.roleartists.findIndex(role => role.roleid === this.selectedRoleId)
      if (indexToChange > -1) {
        this.artistRoleController.setValue(this.beast.artistInfo.roleartists[indexToChange])
      } else {
        this.artistRoleController.setValue('')
      }
    }

    this.locationFiltered = this.locationController.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '', this.beast.allLocations, 'location')),
    );
    this.locationController.setValue(this.beast.allLocations)
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
          } else if (type === 'role conf attack') {
            this.beast.roles[i].attack_conf = event.html
          } else if (type === 'role conf defense') {
            this.beast.roles[i].defense_conf = event.html
          } else if (type === 'role skill attack') {
            this.beast.roles[i].attack_skill = event.html
          } else if (type === 'role skill defense') {
            this.beast.roles[i].defense_skill = event.html
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
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId][type] = event.target.value
    } else {
      this.beast[type] = event.target.value
    }

    if (type === 'knockback') {
      this.setVitalityAndStress()
    } else if (type === 'combatpoints') {
      this.setVitalityAndStress()
      this.calculateMovementSpeed()
    } else if (type === 'skillpoints' || type === 'socialpoints') {
      this.setVitalityAndStress()
    }
  }

  captureSlide = ({ value }, type) => {
    const DESCRIPTIONSHARE = 'descriptionshare'
      , CONVICTIONSHARE = 'convictionshare'
      , DEVOTIONSHARE = 'devotionshare'

    if (this.selectedRoleId) {
      if (type === DESCRIPTIONSHARE) {
        const difference = this.beast.roleInfo[this.selectedRoleId][DESCRIPTIONSHARE] - value
        this.beast.roleInfo[this.selectedRoleId][CONVICTIONSHARE] += difference / 2
        this.beast.roleInfo[this.selectedRoleId][DEVOTIONSHARE] += difference / 2
        this.beast.roleInfo[this.selectedRoleId][DESCRIPTIONSHARE] = value
      } else if (type === CONVICTIONSHARE) {
        const difference = this.beast.roleInfo[this.selectedRoleId][CONVICTIONSHARE] - value
        this.beast.roleInfo[this.selectedRoleId][CONVICTIONSHARE] = value
        this.beast.roleInfo[this.selectedRoleId][DEVOTIONSHARE] += difference / 2
        this.beast.roleInfo[this.selectedRoleId][DESCRIPTIONSHARE] += difference / 2
      } else if (type === DEVOTIONSHARE) {
        const difference = this.beast.roleInfo[this.selectedRoleId][DEVOTIONSHARE] - value
        this.beast.roleInfo[this.selectedRoleId][CONVICTIONSHARE] += difference / 2
        this.beast.roleInfo[this.selectedRoleId][DEVOTIONSHARE] = value
        this.beast.roleInfo[this.selectedRoleId][DESCRIPTIONSHARE] += difference / 2
      }
    } else {
      if (type === DESCRIPTIONSHARE) {
        const difference = this.beast[DESCRIPTIONSHARE] - value
        this.beast[CONVICTIONSHARE] += difference / 2
        this.beast[DEVOTIONSHARE] += difference / 2
        this.beast[DESCRIPTIONSHARE] = value
      } else if (type === CONVICTIONSHARE) {
        const difference = this.beast[CONVICTIONSHARE] - value
        this.beast[CONVICTIONSHARE] = value
        this.beast[DEVOTIONSHARE] += difference / 2
        this.beast[DESCRIPTIONSHARE] += difference / 2
      } else if (type === DEVOTIONSHARE) {
        const difference = this.beast[DEVOTIONSHARE] - value
        this.beast[CONVICTIONSHARE] += difference / 2
        this.beast[DEVOTIONSHARE] = value
        this.beast[DESCRIPTIONSHARE] += difference / 2
      }
    }
  }

  captureInputUnbound = (event, type, index, secondaryType, thirdType) => {
    if (type === 'conflict') {
      let newSecondaryObject = Object.assign({}, this.beast[type])
      newSecondaryObject[secondaryType] = [...newSecondaryObject[secondaryType]]
      newSecondaryObject[secondaryType][index][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (!secondaryType) {
      let objectToModify = { ...this.beast }
      this.beast = Object.assign({}, objectToModify, { [type]: event.target.value })
    } else if (secondaryType && !thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    }
  }
  captureInput = this.captureInputUnbound.bind(this)

  captureSliderInput = (event) => {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].rollundertrauma = event.value
    } else {
      this.beast.rollundertrauma = event.value
    }
  }

  checkRandomizeDescription = (index, checked) => {
    if (checked) {
      this.beast.conflict.descriptions[index].trait = 'Any'
    } else {
      this.beast.conflict.descriptions[index].trait = ''
    }
  }

  checkRandomizeBurden = (index, checked) => {
    if (checked) {
      this.beast.conflict.burdens[index].trait = 'Any'
      if (+this.beast.conflict.burdens[index].value > 4) {
        this.beast.conflict.burdens[index].value = '1'
      }
    } else {
      this.beast.conflict.burdens[index].trait = ''
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

  checkRandomizeflaw = (index, checked) => {
    if (checked) {
      this.beast.conflict.flaws[index].trait = 'Any'
      if (+this.beast.conflict.flaws[index].value > 4) {
        this.beast.conflict.flaws[index].value = '1'
      }
    } else {
      this.beast.conflict.flaws[index].trait = ''
    }
  }

  setRankSeverityRank = (index, value) => {
    this.beast.conflict.burdens[index].value = value
  }

  updateRolesObject(type, value) {
    for (let i = 0; i < this.beast.roles.length; i++) {
      if (this.beast.roles[i].id === this.selectedRoleId) {
        this.beast.roles[i][type] = value
        i = this.beast.roles.length
      }
    }
  }

  checkTraumaUnbound(checked) {
    this.beast.notrauma = checked
  }
  checkTrauma = this.checkTraumaUnbound.bind(this)

  checkCheckBox = (checked, type) => {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId][type] = checked
    } else {
      this.beast[type] = checked
    }

    if ((type === 'hasarchetypes' || type === 'hasmonsterarchetypes') && checked) {
      if (this.selectedRoleId) {
        this.beast.roleInfo[this.selectedRoleId].socialpoints = this.roundby5s(this.beast.roleInfo[this.selectedRoleId].socialpoints)
      } else {
        this.beast.socialpoints = this.roundby5s(this.beast.socialpoints)
      }
    }

    this.setVitalityAndStress()
  }

  roundby5s(amount) {
    return Math.ceil(amount / 5) * 5;
  }

  checkAllRoles = (type, index, checked) => {
    if (type === 'skills') {
      this.beast[type][index].allroles = checked
    } else if (type === 'locationalvitality') {
      this.beast.locationalvitality[index].allroles = checked
    } else if (type === 'movement') {
      this.beast.movement[index].allroles = checked
    } else {
      this.beast.conflict[type][index].allroles = checked
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

    if (type === 'size') {
      this.setVitalityAndStress()
    }
  }

  public alphabet = 'abcdefghij'

  captureSelectForObject(event, type, secondaryType) {
    if (!event.value) {
      event.value = null
    }
    this.beast[secondaryType][type] = event.value

    if (secondaryType === "carriedloot") {
      this.captureSelectForObject({ value: event.value }, type, 'lairloot')
    }
  }

  captureScroll(event, type) {
    this.scroll[type] = event.value
  }

  captureAddScroll(type) {
    this.beast[type].scrolls.push(this.scroll)
    if (type === 'carriedloot') {
      this.beast.lairloot.scrolls.push({ ...this.scroll })
    }
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
    if (type === 'carriedloot') {
      this.beast.lairloot.alms.push({ ...this.alm })
    }
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

  captureAddItemUnbound(item, lootLocation) {
    this.beast[lootLocation].items[item.itemcategory] = item
    if (lootLocation === 'carriedloot' && !this.beast.lairloot.items[item.itemcategory]) {
      this.beast.lairloot.items[item.itemcategory] = { ...item }
    }
  }
  public captureAddItem = this.captureAddItemUnbound.bind(this)

  updateItemUnbound(event, location, type, categoryId) {
    if (event.value) {
      this.beast[location].items[categoryId][type] = event.value
    } else {
      this.beast[location].items[categoryId][type] = event.target.value
    }
  }
  public updateItem = this.updateItemUnbound.bind(this)

  removeItemUnbound(location, categoryId) {
    let { items } = this.beast[location]
    delete items[categoryId]
  }
  public removeItem = this.removeItemUnbound.bind(this)

  captureChip(event, type) {
    if (type === 'types') {
      this.types = { typeid: +event.value }
    } else if (type === 'climate') {
      if (typeof event.value !== 'string') {
        event.value.climateid = event.value.id
      }
      this.climate = event.value
    }
  }

  public landClimates = ['Af', 'Am', 'Aw/As', 'BWh', 'BWk', 'BSh', 'BSk', 'Csa', 'Csb', 'Csc', 'Cwa', 'Cwb', 'Cfb', 'Dsa', 'Dsb', 'Dsc', 'Dsd', 'Dwa', 'Dwb', 'Dwc', 'Dwd', 'Dfa', 'Dfb', 'Dfc', 'Dfd', 'ET', 'EF']
  public aquaticClimates = ['Salt-Water Sea', 'Salt-Water Lake', 'Salt-Water Ocean', 'Salt-Water River', 'Fresh-Water Glacier', 'Fresh-Water Lake', 'Fresh-Water River', 'Fresh-Water Sea']
  public specialClimates = ['Ship', 'Castle', 'Ruin', 'Urban', 'Urban Sewer', 'Dungeon']


  addChip(type) {
    if (this[type] === 'all' && type === 'climate') {
      this.beast.climates.allclimates.forEach(climate => {
        const newClimate = { ...climate, climateid: climate.id }
        this.beast.climates.beast.push(newClimate)
      })
    } else if (this[type] === 'allClimates' && type === 'climate') {
      this.beast.climates.allclimates.forEach(climate => {
        if (this.landClimates.includes(climate.code)) {
          const newClimate = { ...climate, climateid: climate.id }
          this.beast.climates.beast.push(newClimate)
        }
      })
    } else if (this[type] === 'allAquatic' && type === 'climate') {
      this.beast.climates.allclimates.forEach(climate => {
        if (this.aquaticClimates.includes(climate.climate)) {
          const newClimate = { ...climate, climateid: climate.id }
          this.beast.climates.beast.push(newClimate)
        }
      })
    } else if (this[type] === 'allSpecial' && type === 'climate') {
      this.beast.climates.allclimates.forEach(climate => {
        if (this.specialClimates.includes(climate.climate)) {
          const newClimate = { ...climate, climateid: climate.id }
          this.beast.climates.beast.push(newClimate)
        }
      })
    } else if (this[type] && type === 'climate') {
      this.beast.climates.beast.push(this[type])
    } else if (this[type]) {
      this.beast[type].push(this[type])
    }
    this[type] = null;
  }

  captureChallenge(event) {
    if (event.option.value.id && event.option.value.name) {
      this.beast.challenges.push({ challengeid: +event.option.value.id, name: event.option.value.name })
    }
  }

  captureObstacle(event) {
    if (event.option.value.id && event.option.value.name) {
      this.beast.obstacles.push({ obstacleid: +event.option.value.id, name: event.option.value.name })
    }
  }

  addNewSecondaryItem(type, secondType) {
    if (type === 'combatStatArray') {
      if (this.beast[type].length === 0) {
        this.beast[type].push({
          roleid: this.selectedRoleId,
          weapontype: null,
          piercingweapons: null,
          slashingweapons: null,
          crushingweapons: null,
          weaponsmallslashing: null,
          weaponsmallcrushing: null,
          weaponsmallpiercing: null,
          andslashing: null,
          andcrushing: null,
          flanks: null,
          rangeddefence: null,
          alldefense: null,
          allaround: null,
          armorandshields: null,
          unarmored: null,
          attack: null,
          initiative: null,
          measure: null,
          panic: null,
          rangedistance: null,
          recovery: null,
          isspecial: null,
          showonlydefenses: false,
          eua: false,
          tdr: false,
          addsizemod: true,
          weapon: null,
          shield: null,
          armor: null,
          defaultweaponname: null,
          adjustment: 0,
          weaponname: null,
          equipmentBonuses: null
        })
      } else {
        let combatSquareCopy = { id: 0, weaponname: null, weapon: null, armor: null, shield: null, roleid: null }
        if (this.selectedRoleId) {
          for (let i = this.beast[type].length - 1; i >= 0; i--) {
            if (this.beast[type][i].roleid === this.selectedRoleId) {
              combatSquareCopy = { ...this.beast[type][i] }
              i = 0
            }
          }
          if (combatSquareCopy.id === 0) {
            combatSquareCopy = { ...this.beast[type][this.beast[type].length - 1] }
          }
        } else {
          combatSquareCopy = { ...this.beast[type][this.beast[type].length - 1] }
        }
        delete combatSquareCopy.id
        combatSquareCopy.weaponname = null
        combatSquareCopy.weapon = null
        combatSquareCopy.armor = null
        combatSquareCopy.shield = null
        combatSquareCopy.roleid = this.selectedRoleId
        this.beast[type].push(combatSquareCopy)
      }
    } else if (type === 'movement') {
      let movement = {
        stroll: 0,
        walk: 0,
        jog: 0,
        run: 0,
        sprint: 0,
        type: '',
        adjustment: 0,
        roleid: this.selectedRoleId,
        movementSpeeds: { strollspeed: 0, walkspeed: 0, jogspeed: 0, runspeed: 0, sprintspeed: 0 }
      }
      this.beast[type].push(movement)
      this.calculateMovementSpeed()
    } else if (type === 'conflict') {
      let traitType = secondType === 'descriptions' ? 'h' : secondType.substring(0, 1);
      this.beast[type][secondType].push({
        trait: 'Any',
        value: traitType === 'b' ? '1' : '',
        type: traitType,
        socialroleid: this.selectedRoleId,
        severity: null,
        strength: null,
        adjustment: 0
      })
    } else if (type === 'skills') {
      this.beast[type].push({
        skill: '',
        rank: '',
        skillroleid: this.selectedRoleId,
        showAllSkills: true,
        strength: null,
        adjustment: 0
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

  removeNewSecondaryItemUnbound = (type, index, secondType) => {
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
    } else if (type === 'climates') {
      this.beast.climates.beast.push({ uniqueid: deleted[0].uniqueid, deleted: true })
    } else {
      this.beast[type].push({ id: deleted[0].id, deleted: true })
    }
  }

  removeNewSecondaryItem = this.removeNewSecondaryItemUnbound.bind(this)

  removeChip(type, index) {
    this.beast[type].splice(index, 1)
  }

  checkIfValidTemplate = () => {
    const TEMPLATE = 'TEMPLATE'
    if (this.beast.name && this.beast.name.substring(0, TEMPLATE.length).toUpperCase() === TEMPLATE) {
      if (this.templateIds.indexOf(this.beast.id) > -1) {
        return true
      } else {
        return false
      }
    }
    return true
  }

  onMainImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.mainImageObj = FILE;
    const imageForm = new FormData();
    imageForm.append('image', this.mainImageObj);
    this.beastService.uploadMainImage(imageForm, this.beast.id).subscribe(res => {
      this.beast.image = res['image']
      this.getImageUrl()
    });
  }

  onRoleImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.mainImageObj = FILE;
    const imageForm = new FormData();
    imageForm.append('image', this.mainImageObj);
    this.beastService.uploadMainImage(imageForm, `${this.beast.id}${this.selectedRoleId}`).subscribe(res => {
      this.beast.image = res['image']
      this.getImageUrl()
    });
  }

  onTokenImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.tokenImageObj = FILE;
    const imageForm = new FormData();
    imageForm.append('image', this.tokenImageObj);
    this.beastService.uploadTokenImage(imageForm, this.beast.id).subscribe(res => {
      this.seeIfTokenExists()
    });
  }

  onTokenRoleImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.tokenImageObj = FILE;
    const imageForm = new FormData();
    imageForm.append('image', this.tokenImageObj);
    this.beastService.uploadTokenImage(imageForm, `${this.beast.id}${this.selectedRoleId}`).subscribe(res => {
      this.seeIfTokenExists()
    });
  }

  saveChanges() {
    this.beastService.handleMessage({ message: 'Saving Monster', color: 'yellow' })
    let id = this.route.snapshot.paramMap.get('id');

    this.beast.roles = this.beast.roles.map(role => {
      const roleInfo = this.beast.roleInfo[role.id]
      role.fatigue = roleInfo.fatigue
      role.largeweapons = roleInfo.largeweapons
      role.mental = roleInfo.mental
      role.panic = roleInfo.panic
      role.combatpoints = roleInfo.combatpoints
      role.socialpoints = roleInfo.socialpoints
      role.skillpoints = roleInfo.skillpoints
      role.knockback = roleInfo.knockback
      role.singledievitality = roleInfo.singledievitality
      role.isIncorporeal = roleInfo.isIncorporeal
      role.weaponbreakagevitality = roleInfo.weaponbreakagevitality
      role.noknockback = roleInfo.noknockback
      role.rollundertrauma = roleInfo.rollundertrauma
      role.attack = roleInfo.attack
      role.defense = roleInfo.defense
      role.attack_conf = roleInfo.attack_conf
      role.defense_conf = roleInfo.defense_conf
      role.attack_skill = roleInfo.attack_skill
      role.defense_skill = roleInfo.defense_skill
      role.hasarchetypes = roleInfo.hasarchetypes
      role.hasmonsterarchetypes = roleInfo.hasmonsterarchetypes

      return role
    })

    this.beast.encounter = this.encounter
    if (this.deletedSpellList) {
      this.beast.deletedSpellList = this.deletedSpellList
    }
    if (+id) {
      this.beastService.updateBeast(this.beast).subscribe(result => {
        if (result.id) {
          this.beastService.handleMessage({ message: 'Saved!', color: 'green' })
          this.router.navigate([`/beast/${id}/gm`])
        }
      })
    } else {
      this.beastService.addBeast(this.beast).subscribe(result => {
        if (result.id) {
          this.beastService.handleMessage({ message: 'Saved!', color: 'green' })
          this.router.navigate([`/beast/${result.id}/gm`])
        }
      })
    }
  }

  toggleCheckDelete = () => {
    this.checkForDelete = !this.checkForDelete
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

  jumpToOption = (type) => {
    let lastItemValue;
    if (type === 'sign' && this.encounter.signs.signs.length > 0) {
      lastItemValue = this.encounter.signs.signs[this.encounter.signs.signs.length - 1].sign
    } else if (type !== 'sign' && this.encounter[type][type].length > 0) {
      lastItemValue = this.encounter[type][type][this.encounter[type][type].length - 1][type]
    }
    if (lastItemValue) {
      let autocomplete = this[type + 'Autocomplete'];
      if (autocomplete) {
        autocomplete.options.forEach(item => {
          if (item.value[type] === lastItemValue) {
            document.getElementById(item.id).scrollIntoView();
          }
        })
      }
    }
  }

  displayNameForLootValue(value) {
    const dictionary = {
      a: 'None',
      b: 'Low',
      c: 'Medium',
      d: 'High',
      e: 'Low, Nonscaling',
      f: 'Medium, Nonscaling',
      g: 'High, Nonscaling'
    }

    return dictionary[value]
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

  getDisplayTextLocation = (option) => {
    return option.location
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

  captureEncounterSecondaryUnbound({ value }, type, index, secondaryType) {
    let newSecondaryObject = Object.assign([], this.beast[type])
    newSecondaryObject[index] = { ...newSecondaryObject[index] }
    newSecondaryObject[index][secondaryType] = value
    this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
  }

  captureEncounterSecondary = this.captureEncounterSecondaryUnbound.bind(this)

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
    return `${chances.minor}% of Minor`
  }

  setArtist(event) {
    let { artist, tooltip, link, id: artistid } = event.option.value
    this.beast.artistInfo.artistid = artistid
    this.beast.artistInfo.artist = artist
    this.beast.artistInfo.tooltip = tooltip
    this.beast.artistInfo.link = link
  }

  setRoleArtist(event) {
    let { artist, tooltip, link, id: artistid } = event.option.value
    const indexToChange = this.beast.artistInfo.roleartists.findIndex(role => role.roleid === this.selectedRoleId)

    if (indexToChange === -1) {
      this.beast.artistInfo.roleartists.push({ artistid, artist, tooltip, link, roleid: this.selectedRoleId })
    }
  }

  setLocation(event) {
    let { location, link, id: locationid } = event.option.value
    this.beast.locations.push({ location, link, locationid })
  }

  captureNewLocation(type, event) {
    if (event.target) {
      this.location[type] = event.target.value
    } else {
      this.location[type] = event.value
    }
  }

  checkIfSoloOrElite(secondary) {
    let secondaryRole = null
    if (this.selectedRoleId) {
      secondaryRole = this.beast.roleInfo[this.selectedRoleId][secondary]
    } else {
      secondaryRole = this.beast[secondary]
    }

    return secondaryRole && (secondaryRole === 'Elite' || secondaryRole === 'Solo')
  }

  produceEliteOrSoloAdditionalExplanation(secondary) {
    let secondaryRole = null
    if (this.selectedRoleId) {
      secondaryRole = this.beast.roleInfo[this.selectedRoleId][secondary]
    } else {
      secondaryRole = this.beast[secondary]
    }

    return `${secondaryRole}s should have 1 - ${secondaryRole === 'Solo' ? '3' : '2'} of the following types of abilities:`
  }

  produceEliteOrSoloSocialAdditionalExplanation() {
    let secondaryRole = null
      , points = 0
    if (this.selectedRoleId) {
      secondaryRole = this.beast.roleInfo[this.selectedRoleId].socialsecondary
      points = this.beast.roleInfo[this.selectedRoleId].socialpoints + 1
    } else {
      secondaryRole = this.beast.socialsecondary
      points = this.beast.socialpoints + 1
    }

    if (secondaryRole === "Elite") {
      return `For an Elite of this power, they would need abilities or general Conviction worth ${Math.floor(1.5 * points)} Ranks. They can also provide half this bonus to their allies.`
    } else {
      return `For a Solo of this power, they would need abilities or general Conviction worth ${Math.floor(3 * points)} Ranks.\nAnd have an ability that triggers when they reach 3 Emotional States.`
    }
  }

  produceEliteOrSoloSkillAdditionalExplanation() {
    let secondaryRole = null
      , points = 0
    if (this.selectedRoleId) {
      secondaryRole = this.beast.roleInfo[this.selectedRoleId].skillsecondary
      points = this.beast.roleInfo[this.selectedRoleId].socialpoints + 1
    } else {
      secondaryRole = this.beast.skillsecondary
      points = this.beast.socialpoints + 1
    }

    if (secondaryRole === "Elite") {
      return `For an Elite of this power, they would need abilities worth ${Math.floor(1.5 * points)} Boons. They can also provide half this bonus to their allies.`
    } else {
      return `For a Solo of this power, they would need abilities worth ${Math.floor(3 * points)} Boons.\nAnd have an ability that triggers when they become Panicked/Fatigued.`
    }
  }


  addExtraIfSolo(secondary) {
    let secondaryRole = null
    if (this.selectedRoleId) {
      secondaryRole = this.beast.roleInfo[this.selectedRoleId][secondary]
    } else {
      secondaryRole = this.beast[secondary]
    }
    return secondaryRole === 'Solo'
  }

  addNewLocation() {
    let { location, link } = this.location
    this.beast.locations.push({ location, link })

    this.location = {
      id: null,
      location: null,
      link: null
    }

    this.viewPanels.forEach(p => p.close());
    this.artistName.nativeElement.value = null
    this.artistLink.nativeElement.value = null
    this.artistTooltip.nativeElement.value = null
  }

  captureNewArtist(type, event) {
    if (event.target) {
      this.artist[type] = event.target.value
    } else {
      this.artist[type] = event.value
    }
  }

  addNewArtist() {
    this.beast.artistInfo.allartists.push(this.artist)
    this.artistFiltered = this.artistController.valueChanges.pipe(
      startWith(this.artist),
      map((value: string) => this._filter(value || '', this.beast.artistInfo.allartists, 'artist')),
    );
    this.artistController.setValue(this.beast.artistInfo)

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
    this.locationLocation.nativeElement.value = null
    this.locationLink.nativeElement.value = null
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

    if (this.selectedRoleId) {
      const indexToChange = this.beast.artistInfo.roleartists.findIndex(role => role.roleid === this.selectedRoleId)
      if (indexToChange > -1) {
        this.artistRoleController.setValue(this.beast.artistInfo.roleartists[indexToChange])
      } else {
        this.artistRoleController.setValue('')
      }
    }

    this.getImageUrl()
    this.seeIfRoleTokenExists()
    this.setVitalityAndStress()
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

    this.setVitalityAndStress()
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

    this.setVitalityAndStress()
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

  setSkillSecondaryRoleType(event) {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].skillsecondary = event.value
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].skillsecondary = event.value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.skillsecondary = event.value
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

  setPoints(event, pointType) {
    const value = +event.value
    if (this.selectedRoleId) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i][pointType] = value
          this.beast.roleInfo[this.selectedRoleId][pointType] = value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast[pointType] = value
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
      this.beast.conflict.burdens.forEach(val => {
        val.socialroleid = id
      })

      this.beast.skills.forEach(val => {
        val.skillroleid = id
      })

      this.beast.combatStatArray.forEach(val => {
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
        skillsecondary: this.newRole.skillsecondary
      }
      if (areRolesFilledOutAndAddingFirstRole) {
        let { role, secondaryrole, socialrole, socialsecondary, skillrole, skillsecondary } = this.beast
        rolesToAdd = {
          role: role ? role : this.newRole.role,
          secondaryrole: secondaryrole ? secondaryrole : this.newRole.secondaryrole,
          socialrole: socialrole ? socialrole : this.newRole.socialrole,
          socialsecondary: socialsecondary ? socialsecondary : this.newRole.socialsecondary,
          skillrole: skillrole ? skillrole : this.newRole.skillrole,
          skillsecondary: skillsecondary ? skillsecondary : this.newRole.skillsecondary
        }
      }

      this.beast.roleInfo[id] = {
        attack: null,
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
        largeweapons: this.beast.largeweapons,
        mental: this.beast.mental,
        fatigue: this.beast.fatigue,
        rollundertrauma: this.beast.rollundertrauma,
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
        skillsecondary: this.newRole.skillsecondary
      }
      if (areRolesFilledOutAndAddingFirstRole) {
        let { role, secondaryrole, socialrole, socialsecondary, skillrole, skillsecondary } = this.beast
        rolesToAdd = {
          role: role ? role : this.newRole.role,
          secondaryrole: secondaryrole ? secondaryrole : this.newRole.secondaryrole,
          socialrole: socialrole ? socialrole : this.newRole.socialrole,
          socialsecondary: socialsecondary ? socialsecondary : this.newRole.socialsecondary,
          skillrole: skillrole ? skillrole : this.newRole.skillrole,
          skillsecondary: skillsecondary ? skillsecondary : this.newRole.skillsecondary
        }
      }

      this.beast.roleInfo[id] = {
        attack: null,
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
        largeweapons: null,
        mental: null,
        fatigue: null,
        rollundertrauma: 10,
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
      socialsecondary: null,
      skillsecondary: null
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
      resist: null,
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

  captureFolklore(type, index, event) {
    this.beast.folklore[index][type] = event.target.value
  }

  deleteFolkloreEntry(index) {
    this.beast.folklore.splice(index, 1)
  }

  captureNewFolklore(type, event) {
    this.folklore[type] = event.target.value
  }

  addNewFolklore() {
    if (this.folklore.belief && this.folklore.truth) {
      this.beast.folklore.push(this.folklore)
      this.folklore = {
        belief: null,
        truth: null
      }
    }
  }

  captureScenario(index, event) {
    this.beast.scenarios[index].scenario = event.target.value
  }

  deleteScenarioEntry(index) {
    this.beast.scenarios.splice(index, 1)
  }

  captureNewScenario(event) {
    this.scenario = event.target.value
  }

  addNewScenario() {
    if (this.scenario) {
      this.beast.scenarios.push({ scenario: this.scenario })
      this.scenario = null
    }
  }

  checkCharacteristic = (type, index, value, event) => {
    if (!value) {
      event.source._checked = false
    }

    if (this.beast.conflict[type][index].strength === value) {
      this.beast.conflict[type][index].strength = null
    } else {
      this.beast.conflict[type][index].strength = value
    }
  }

  checkSkill = (value, index, event) => {
    if (!value) {
      event.source._checked = false
    }

    if (this.beast.skills[index].strength === value) {
      this.beast.skills[index].strength = null
    } else {
      this.beast.skills[index].strength = value
    }
  }

  checkBurden = (burden, value, event) => {
    if (burden.value === value) {
      burden.value = value
      event.source._checked = true
    } else {
      burden.value = value
    }
  }

  checkStat = (stat, value, event) => {
    if (!value) {
      event.source._checked = false
    }

    if (this.selectedRoleId) {
      const roleStat = this.selectedRoleId ? this.selectedRole.meleeCombatStats : null
      if (roleStat && roleStat[stat] === value) {
        event.source._checked = true
        this.beast.roleInfo[this.selectedRoleId][stat] = null
      } else if (this.beast.roleInfo[this.selectedRoleId][stat] === value) {
        this.beast.roleInfo[this.selectedRoleId][stat] = null
      } else {
        this.beast.roleInfo[this.selectedRoleId][stat] = value
      }
    } else {
      const roleStat = this.beast.role ? roles.combatRoles.primary[this.beast.role].meleeCombatStats : null
      if (roleStat && roleStat[stat] === value) {
        event.source._checked = true
        this.beast[stat] = null
      } else if (this.beast[stat] === value) {
        this.beast[stat] = null
      } else {
        this.beast[stat] = value
      }
    }

    this.setVitalityAndStress()
  }

  setVitalityAndStress = () => {
    let size
    if (this.beast.roleInfo[this.selectedRoleId] && this.beast.roleInfo[this.selectedRoleId].size) {
      size = this.beast.roleInfo[this.selectedRoleId].size
    } else if (this.beast.size) {
      size = this.beast.size
    } else {
      size = 'Medium'
    }

    let knockback
    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].knockback) {
      knockback = this.beast.roleInfo[this.selectedRoleId].knockback
    } else if (this.beast.knockback) {
      knockback = this.beast.knockback
    }

    const combatStats = {
      panic: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].panic : this.beast.panic,
      mental: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].mental : this.beast.mental,
      largeweapons: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].largeweapons : this.beast.largeweapons,
      fatigue: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].fatigue : this.beast.fatigue,
      singledievitality: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].singledievitality : this.beast.singledievitality,
      isincorporeal: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].isincorporeal : this.beast.isincorporeal,
      weaponbreakagevitality: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].weaponbreakagevitality : this.beast.weaponbreakagevitality,
      noknockback: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].noknockback : this.beast.noknockback,
      initiative: this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].initiative : this.beast.initiative
    }

    const combatpoints = this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].combatpoints : this.beast.combatpoints
    const skillpoints = this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].skillpoints : this.beast.skillpoints
    const socialpoints = this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].socialpoints : this.beast.socialpoints
    const role = this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].role : this.beast.role
    const secondaryrole = this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId].secondaryrole : this.beast.secondaryrole

    this.beastService.getVitalityAndStress(combatpoints, Math.max(combatpoints, skillpoints, socialpoints), role, combatStats, secondaryrole, knockback, size, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].armor : null, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].shield : null).subscribe(res => {
      this.physical = res.physical
      this.mental = res.mental
    })
  }

  checkMovementStat = async (stat, value, event, index) => {
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

    this.calculateMovementSpeed()
  }

  getAdjustment = async (type, index, event) => {
    this.beast[type][index].adjustment = +event.target.value

    this.calculateMovementSpeed()
  }

  calculateMovementSpeed = () => {
    const newMovements = this.beast.movement.map(movementType => {
      const points = movementType.roleid ? this.beast.roleInfo[movementType.roleid].combatpoints : this.beast.combatpoints
      const role = movementType.roleid ? this.beast.roleInfo[movementType.roleid].role : this.beast.role
      movementType.role = role
      movementType.points = points

      return movementType
    })

    this.beastService.getMovement(newMovements).subscribe(res => {
      this.beast.movement = res
    })
  }

  getSkillRank(strength, adjustment = 0) {
    const skillpoints = this.selectedRoleId ? this.beast.roleInfo[this.selectedRoleId].skillpoints : this.beast.skillpoints
    return this.beastService.calculateRankForSkill(+skillpoints, strength, adjustment)
  }

  getImageUrl() {
    this.imageUrl = this.imageBase + this.beast.id + (this.selectedRoleId ? `${this.selectedRoleId}` : '') + '?t=' + new Date().getSeconds()
    this.previewUrl = this.imageBase + this.beast.id + '?t=' + new Date().getSeconds()
  }

  onImageError(event) {
    event.target.onerror = null;
    const baseImage = this.imageBase + this.beast.id
    const imageSource = this.imageBase + this.beast.imagesource
    const error404 = '/assets/404.png'
    if (event.target.src === baseImage) {
      this.hasNoBaseImage = true
      if (this.beast.imagesource) {
        event.target.src = imageSource
      } else {
        event.target.src = error404;
      }
    } else if (event.target.src !== imageSource || event.target.src !== error404) {
      event.target.src = baseImage
    }
  }

  seeIfTokenExists() {
    this.beastService.checkToken(this.beast.id).subscribe((res: Boolean) => {
      this.tokenExists = res
    })
    this.seeIfRoleTokenExists()
  }

  seeIfRoleTokenExists() {
    this.beastService.checkToken(`${this.beast.id}${this.selectedRoleId}`).subscribe((res: Boolean) => {
      this.roleTokenExists = res
    })
  }

  processNameAndRoleOrder(name, rolename, rolenameorder) {
    if (rolename && rolename.toUpperCase() !== "NONE") {
      if (rolenameorder === '1') {
        return name + " " + rolename
      } else if (rolenameorder === '3') {
        return rolename
      } else {
        return rolename + " " + name
      }
    }
  }

  forceDownload(isRole) {
    var xhr = new XMLHttpRequest();
    const idBase = isRole ? this.beast.id + this.selectedRoleId : this.beast.id
    const idToUse = this.tokenExists ? idBase : this.beast.imagesource
    xhr.open("GET", 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + idToUse + '-token', true);
    xhr.responseType = "blob";
    const beastName = isRole ? this.processNameAndRoleOrder(this.beast.name, this.beast.roleInfo[this.selectedRoleId].name, this.beast.rolenameorder ? this.beast.rolenameorder : '1') : this.beast.name
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = beastName + '.png';
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }

  toggleCheckDeleteRole = () => {
    this.checkForDeleteRole = !this.checkForDeleteRole
  }

  toggleArchetypesForAllRoles = (type) => {
    this.beast.roles = this.beast.roles.map(role => {
      role[type] = !role[type]
      this.beast.roleInfo[role.id][type] = role[type]
      return role
    })
  }

  deleteRole() {
    this.checkForDeleteRole = false
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
    this.beast.conflict.burdens.forEach((subcat, index) => {
      if (this.selectedRoleId === subcat.socialroleid) {
        this.removeNewSecondaryItem('conflict', index, 'burdens')
      }
    })

    this.beast.skills.forEach((cat, index) => {
      if (this.selectedRoleId === cat.skillroleid) {
        this.removeNewSecondaryItem('skills', index, null)
      }
    })

    this.beast.combatStatArray.forEach((cat, index) => {
      if (this.selectedRoleId === cat.roleid) {
        this.removeNewSecondaryItem('combatStatArray', index, null)
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

  removeCombatStatFromArray = (index) => {
    this.beast.combatStatArray.splice(index, 1)
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
      , skillsecondary = roleInfo.skillsecondary
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
      if (skillsecondary) {
        nameString += ` (${skillsecondary})`
      }
    }

    if (roles) {
      nameString += ']'
    }

    return nameString
  }

  addNewTable = (table) => {
    const blankTable = {
      label: null,
      rows: []
    }

    this.beast.tables[table].push(blankTable)
  }

  removeTable = (table) => {
    return (index) => {
      this.beast.tables[table].splice(index, 1)
    }
  }

  formatPoints(pointsType) {
    return this.ratingsObject[this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId] ? this.beast.roleInfo[this.selectedRoleId][pointsType] : this.beast[pointsType] ? this.beast[pointsType] : 0]
  }
}
