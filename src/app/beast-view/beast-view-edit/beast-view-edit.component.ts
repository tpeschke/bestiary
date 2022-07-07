import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import variables from '../../../local.js'
import { CalculatorService } from '../../util/services/calculator.service';
import lootTables from "../loot-tables.js"
import roles from '../roles.js'
import { MatExpansionPanel, MatSelect } from '@angular/material';

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewEditComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('newRoleName') newRoleName;
  @ViewChild('newCombatRoleSelect') newCombatRoleSelect: MatSelect;
  @ViewChild('newSecondaryRoleSelect') newSecondaryRoleSelect: MatSelect;
  @ViewChild('newConfRoleSelect') newConfRoleSelect: MatSelect;
  @ViewChild('newSkillRoleSelect') newSkillRoleSelect: MatSelect;
  imageObj: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
  ) { }

  public beast = null;
  public encounter = null;
  public loggedIn = this.beastService.loggedIn || false;
  public types = null;
  public environ = null;
  public imageBase = variables.imageBase;
  public uploader: any;
  public newVariantId = null;
  public newChallengeId = null;
  public averageVitality = null;
  public lootTables = lootTables;
  public selectedRoleId = null;
  public selectedRole = {}
  public selectedSocialRole = {}
  public selectedSkillRole = {}
  public newRole = {
    name: null,
    role: null,
    secondaryrole: null,
    socialrole: null,
    skillrole: null
  };
  public deletedSpellList = null;

  public temperament = {
    temperament: null,
    tooltip: null,
    weight: null
  };
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

  public combatRoles = ['Artillery', 'Brute', 'Defender', 'Fencer', 'Flanker', 'Fodder', 'Shock', 'Skirmisher']
  public socialRoles = ['Corruptor', 'Defender', 'Enabler', 'Gaslighter', 'Fast-Talker', 'Feinter', 'Opportunist', 'Sandbagger', 'Support', 'Striker']
  public skillRoles = ['Hunter', 'Prey', 'Controller', 'Lock', 'Conditional', 'Antagonist', 'Trap', 'Hazard']

  combatRolesInfo = roles.combatRoles.primary;
  socialRolesInfo = roles.socialRoles;
  skillRolesInfo = roles.skillRoles;
  public combatRolesSecondary = ['Captain', 'Controller', 'Solo']

  public combatSkills = ['Endurance', 'Jumping', 'Climbing', 'Move Silently', 'Hiding', 'Swimming', 'Acrobatics', 'Escape Artist', 'Warfare']

  ngOnInit() {
    this.route.data.subscribe(data => {
      let beast = data['beast']
      if (this.route.snapshot.params.templateId) {
        beast.variants.push({ variantid: beast.id })
        delete beast.id
        beast.name = beast.name + " Template"
        this.beast = beast
        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        }
        this.beastService.getEditEncounter(this.route.snapshot.params.templateId).subscribe(encounter => {
          this.encounter = encounter
        })
      } else if (beast) {
        this.beast = beast
        if (this.beast.role) {
          this.selectedRole = this.combatRolesInfo[this.beast.role]
        }
        if (this.beast.socialrole) {
          this.selectedSocialRole = this.socialRolesInfo[this.beast.socialrole]
        }
        if (this.beast.skillrole) {
          this.selectedSkillRole = this.skillRolesInfo[this.beast.skillrole]
        }
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
        this.beastService.getEditEncounter(this.beast.id).subscribe(encounter => {
          this.encounter = encounter
        })
      } else {
        this.beastService.getEditEncounter(0).subscribe(encounter => {
          this.encounter = encounter
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
          patreon: 0,
          vitality: '',
          panic: '',
          stress: 0,
          combat: [],
          conflict: { traits: [], devotions: [], flaws: [], passions: [] },
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
          roles: [],
          casting: {
            augur: null,
            wild: null,
            vancian: null,
            spellnumberdie: 'd4',
            manifesting: null,
            commanding: null,
            bloodpact: null
          },
          challenges: []
        }
      }
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      this.beast.roles.forEach(role => {
        if (role.vitality) {
          this.beast.roleInfo[role.id].average = this.calculatorService.rollDice(role.vitality)
        }
      })

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

  captureInputUnbound = (event, type, index, secondaryType, thirdType) => {
    if (type === 'conflict') {
      if (thirdType === 'value') {
        this.getValueForPointChange(secondaryType, this.beast[type][secondaryType][index][thirdType], event.target.value)
      }
      let newSecondaryObject = Object.assign({}, this.beast[type])
      newSecondaryObject[secondaryType] = [...newSecondaryObject[secondaryType]]
      newSecondaryObject[secondaryType][index][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (!secondaryType) {
      this.getValueForPointChange(type, this.beast[type], event.target.value)
      let objectToModify = { ...this.beast }
      if (this.selectedRoleId && (type === 'stress' || type === 'caution')) {
        objectToModify = this.beast.roleInfo[this.selectedRoleId]
        this.beast.roleInfo[this.selectedRoleId] = Object.assign({}, objectToModify, { [type]: event.target.value })
      } else {
        this.beast = Object.assign({}, objectToModify, { [type]: event.target.value })
      }
      if (type === 'vitality') {
        this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      }
    } else if (secondaryType && !thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      this.updateSkillPoints(newSecondaryObject[index].skill, newSecondaryObject[index][secondaryType], event.target.value)
      newSecondaryObject[index][secondaryType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (thirdType) {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    }
  }
  captureInput = this.captureInputUnbound.bind(this)

  checkRandomizeTrait = (index, checked) => {
    if (checked) {
      this.beast.conflict.traits[index].trait = 'Any'
    } else {
      this.beast.conflict.traits[index].trait = ''
    }
  }

  captureSelect(event, type, index, secondaryType) {
    if (secondaryType) {
      if (event.value === 'r' && !this.beast[type][index].ranges) {
        this.beast[type][index].ranges = { maxrange: 0 }
      }
      this.beast[type][index][secondaryType] = event.value;
    } else {
      this.getValueForPointChange(type, this.beast[type], event.value)
      if (this.selectedRoleId && type === 'panic') {
        this.beast.roleInfo[this.selectedRoleId][type] = event.value
      } else {
        this.beast[type] = event.value
      }
    }
  }

  captureSelectForObject(event, type, secondaryType) {
    if (!event.value) {
      event.value = null
    }
    this.beast[secondaryType][type] = event.value
  }

  getValueForPointChange = (type, oldValue, newValue) => {
    let valueToCompare = 0
    let valueChange;
    if (type !== 'traits' && type !== 'devotions' && type !== 'flaws') {
      if (type === 'panic') {
        valueChange = this.getPanicValue(oldValue) - this.getPanicValue(newValue)
      } else if (type === 'vitality' && !this.selectedRoleId) {
        let oldValue = 0
        if (this.beast.roleInfo[this.selectedRoleId] && this.beast.roleInfo[this.selectedRoleId].average) {
          oldValue = this.beast.roleInfo[this.selectedRoleId].average
        } else if (this.averageVitality) {
          oldValue = this.averageVitality
        }
        if (!this.selectedRoleId) {
          valueToCompare = this.calculatorService.calculateAverageOfDice(newValue) - oldValue
        } else {
          valueToCompare = this.calculatorService.calculateAverageOfDice(newValue) - oldValue
        }
        valueChange = Math.ceil(valueToCompare / 10)
      } else {
        valueToCompare = newValue - oldValue

        switch (type) {
          case 'stress':
          case 'caution':
            valueChange = Math.ceil(valueToCompare / 5)
            break
          default:
            valueChange = 0
            console.log('could\'t find ' + type)
        }
      }

      this.updateCombatPoints(valueChange);
    } else {
      this.updateSocialPoints(+newValue - +oldValue)
    }

  }

  getPanicValue = (panicValue) => {
    switch (panicValue) {
      case 1:
        return -2;
      case 2:
        return -2;
      case 3:
        return -2;
      case 4:
        return -2;
      case 5:
        return 0;
      case 7:
        return 2;
    }
  }

  captureEquipment(event, type) {
    this.equipment[type] = event.value
  }

  captureAddEquipment() {
    this.beast.lairloot.equipment.push(this.equipment)
    this.equipment = {
      number: null,
      value: null
    }
  }

  removeEqupment(index) {
    let { equipment } = this.beast.lairloot
    if (equipment[index].beastid) {
      equipment[index].deleted = true
    } else {
      equipment.splice(index, 1)
    }
  }

  captureTraited(event, type) {
    this.traited[type] = event.value
  }

  captureAddTraited() {
    this.beast.lairloot.traited.push(this.traited)
    this.traited = {
      chancetable: null,
      value: null
    }
  }

  removeTraited(index) {
    let { traited } = this.beast.lairloot
    if (traited[index].beastid) {
      traited[index].deleted = true
    } else {
      traited.splice(index, 1)
    }
  }

  captureScroll(event, type) {
    this.scroll[type] = event.value
  }

  captureAddScroll() {
    this.beast.lairloot.scrolls.push(this.scroll)
    this.scroll = {
      number: null,
      power: null
    }
  }

  removeScroll(index) {
    let { scrolls } = this.beast.lairloot
    if (scrolls[index].beastid) {
      scrolls[index].deleted = true
    } else {
      scrolls.splice(index, 1)
    }
  }

  captureAlm(event, type) {
    this.alm[type] = event.value
  }

  captureAddAlm() {
    this.beast.lairloot.alms.push(this.alm)
    this.alm = {
      number: null,
      favor: null
    }
  }

  removeAlm(index) {
    let { alms } = this.beast.lairloot
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
        roleid: this.selectedRoleId
      })
    } else if (type === 'movement') {
      this.beast[type].push({
        stroll: 0,
        walk: 0,
        jog: 0,
        run: 0,
        sprint: 0,
        type: '',
        roleid: this.selectedRoleId
      })
    } else if (type === 'conflict') {
      this.beast[type][secondType].push({
        trait: '',
        value: '',
        type: secondType.substring(0, 1),
        socialroleid: this.selectedRoleId
      })
    } else if (type === 'skills') {
      this.beast[type].push({
        skill: '',
        rank: '',
        skillroleid: this.selectedRoleId
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
  }

  onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    this.beastService.imageUpload(imageForm, this.beast.id).subscribe(res => {
      this.beast.image = res['image']
    });
  }

  saveChanges() {
    let id = this.route.snapshot.paramMap.get('id');
    this.beast.combat = this.beast.combat.map(weapon => {
      if (!weapon.deleted) {
        weapon.damage = weapon.newDamage.dice.join(' +')
        let modifier = weapon.newDamage.flat
        if (modifier > 0) {
          modifier = ` +${modifier}`
        } else if (modifier === 0) {
          modifier = ''
        }
        weapon.damage += modifier
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
    this.encounter[type][subtype].push(this[type])
    if (type === 'temperament') {
      this.temperament = {
        temperament: null,
        tooltip: null,
        weight: null
      }
    } else if (type === 'rank') {
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
    }
  }

  captureEncounter({ value }, type) {
    this[type] = value
  }

  captureEncounterInputInt(event, type, subtype) {
    this[type][subtype] = +event.target.value
  }

  captureEncounterInput(event, type, subtype) {
    this[type][subtype] = event.target.value
  }

  removeEncounterItem(index, type, subtype) {
    let deleted = this.encounter[type][subtype].splice(index, 1)[0]
    deleted.deleted = true
    delete deleted.weight;
    if (deleted.id) {
      this.encounter[type][subtype].push(deleted)
    }
    if (type === 'temperament' && deleted.id) {
      let cleanVersion = { ...deleted }
      cleanVersion.deleted = false
      this.encounter[type].allTemp.push(cleanVersion)
    }
  }

  formatRelicAndEnchantedChange(chances) {
    return `${chances.minor}% of Minor, ${chances.middling}% of Middling`
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
  }

  setSecondaryRoleType(event) {
    if (this.selectedRoleId) {
      for (let i = 0; i < this.beast.roles.length; i++) {
        if (this.selectedRoleId === this.beast.roles[i].id) {
          this.beast.roles[i].secondaryrole = event.value
          i = this.beast.roles.length
        }
      }
    } else {
      this.beast.secondaryrole = event.value
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
    if ((this.newRole.role || this.newRole.socialrole || this.newRole.skillrole) && this.newRole.name) {
      let id = this.makeId()
      this.beast.roles.push({ id, ...this.newRole })
      this.beast.roleInfo[id] = {
        attack: null,
        caution: null,
        combatpoints: 0,
        defense: null,
        hash: null,
        name: this.newRole.name,
        panic: null,
        role: this.newRole.role,
        secondaryrole: this.newRole.secondaryrole,
        socialrole: this.newRole.socialrole,
        socialpoints: 0,
        skillrole: this.newRole.skillrole,
        skillpoints: 0,
        stress: null,
        uniqueCombat: true,
        uniqueLocationalVitality: false,
        uniqueMovement: false,
        vitality: null
      }
      this.newRole = {
        name: null,
        role: null,
        secondaryrole: null,
        socialrole: null,
        skillrole: null
      }
      this.viewPanels.forEach(p => p.close());
      this.newRoleName.nativeElement.value = null
      this.newCombatRoleSelect.options.forEach((data) => data.deselect())
      this.newSecondaryRoleSelect.options.forEach((data) => data.deselect())
      this.newConfRoleSelect.options.forEach((data) => data.deselect())
      this.newSkillRoleSelect.options.forEach((data) => data.deselect())
    }
  }

  captureRoleVitality(event) {
    for (let i = 0; i < this.beast.roles.length; i++) {
      if (this.beast.roles[i].id === this.selectedRoleId) {
        this.getValueForPointChange('vitality', this.beast.roles[i].vitality, event.target.value)
        this.beast.roles[i].vitality = event.target.value
        this.beast.roles[i].average = this.calculatorService.calculateAverageOfDice(event.target.value)
        i = this.beast.roles.length
      }
    }
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
      effect: null
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
    combatpoints += Math.ceil(this.averageVitality / 10)
    combatpoints += Math.ceil(this.beast.stress / 5)

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

    this.beast.combat.forEach(weapon => {
      if (weapon.roleid === null) {
        let { def, newDR, parry, newShieldDr, newDamage, atk, rangedDamage, spd, measure, ranges, weapontype, fatigue } = weapon
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
        combatpoints += eval(def)
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

    this.beast.combatpoints = combatpoints

    //Roles
    this.beast.roles.forEach(role => {
      let combatpoints = 0
      if (role.averageVitality) {
        combatpoints += Math.ceil(role.averageVitality / 10)
      } else {
        combatpoints += Math.ceil(this.averageVitality / 10)
      }
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

      if (weapons.length > 0) {
        weapons.forEach(weapon => {
          if (weapon.roleid === null) {
            let { def, newDR, parry, newShieldDr, newDamage, atk, spd, measure, ranges, weapontype, fatigue } = weapon
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
            combatpoints += eval(def)
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

      role.combatpoints = combatpoints
      this.beast.roleInfo[role.id].combatpoints = combatpoints
    })
  }

  calculateSocialPoints = () => {
    let socialpoints = 0

    socialpoints += Math.ceil(this.beast.stress / 5)

    if (this.beast.panic === 1) {
      socialpoints -= 8
    } else if (this.beast.panic === 2) {
      socialpoints -= 6
    } else if (this.beast.panic === 3) {
      socialpoints -= 4
    } else if (this.beast.panic === 4) {
      socialpoints -= 2
    } else if (this.beast.panic === 7) {
      socialpoints += 2
    }

    this.beast.conflict.devotions.forEach(trait => {
      if (!trait.socialroleid) {
        socialpoints += +trait.value
      }
    })
    this.beast.conflict.flaws.forEach(trait => {
      if (!trait.socialroleid) {
        socialpoints += 2
      }
    })
    this.beast.conflict.traits.forEach(trait => {
      if (!trait.socialroleid) {
        socialpoints += +trait.value
      }
    })

    this.beast.socialpoints = socialpoints

    this.beast.roles.forEach(role => {
      let socialpoints = 0

      let panic = role.panic ? role.panic : this.beast.panic
      if (panic === 1) {
        socialpoints -= 8
      } else if (panic === 2) {
        socialpoints -= 6
      } else if (panic === 3) {
        socialpoints -= 4
      } else if (panic === 4) {
        socialpoints -= 2
      } else if (panic === 7) {
        socialpoints += 2
      }

      this.beast.conflict.devotions.forEach(trait => {
        if (trait.socialroleid === role.id) {
          socialpoints += +trait.value
        }
      })
      this.beast.conflict.flaws.forEach(trait => {
        if (trait.socialroleid === role.id) {
          socialpoints += +trait.value
        }
      })
      this.beast.conflict.traits.forEach(trait => {
        if (trait.socialroleid === role.id) {
          socialpoints += +trait.value
        }
      })

      role.socialpoints = socialpoints
      this.beast.roleInfo[role.id].socialpoints = socialpoints
    })
  }

  calculateSkillPoints = () => {
    let skillpoints = 0

    skillpoints += Math.ceil(this.beast.stress / 5)

    if (this.beast.panic === 1) {
      skillpoints -= 8
    } else if (this.beast.panic === 2) {
      skillpoints -= 6
    } else if (this.beast.panic === 3) {
      skillpoints -= 4
    } else if (this.beast.panic === 4) {
      skillpoints -= 2
    } else if (this.beast.panic === 7) {
      skillpoints += 2
    }
    
    this.beast.skills.forEach(skill => {
      if (!skill.skillroleid) {
        skillpoints += +skill.rank
      }
    })

    this.beast.skillpoints = skillpoints

    this.beast.roles.forEach(role => {
      let skillpoints = 0
      
      let panic = role.panic ? role.panic : this.beast.panic
      if (panic === 1) {
        skillpoints -= 8
      } else if (panic === 2) {
        skillpoints -= 6
      } else if (panic === 3) {
        skillpoints -= 4
      } else if (panic === 4) {
        skillpoints -= 2
      } else if (panic === 7) {
        skillpoints += 2
      }

      this.beast.skills.forEach(skill => {
        if (skill.skillroleid === role.id) {
          skillpoints += +skill.rank
        }
      })

      role.skillpoints = skillpoints
      this.beast.roleInfo[role.id].skillpoints = skillpoints
    })
  }

  updateCombatPoints = (value) => {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].combatpoints += value
    } else {
      this.beast.combatpoints += value
    }
  }

  updateSocialPoints = (value) => {
    if (this.selectedRoleId) {
      this.beast.roleInfo[this.selectedRoleId].socialpoints += value
    } else {
      this.beast.socialpoints += value
    }
  }

  updateSkillPoints = (skill, oldvalue, newvalue) => {
    if (newvalue && oldvalue) {
      let value = +newvalue - +oldvalue

      if (this.combatSkills.includes(skill)) {
        if (this.selectedRoleId) {
          this.beast.roleInfo[this.selectedRoleId].combatpoints += value
        } else {
          this.beast.combatpoints += value
        }
      }
      if (this.selectedRoleId) {
        this.beast.roleInfo[this.selectedRoleId].skillpoints += value
      } else {
        this.beast.skillpoints += value
      }
    }
  }

  convertPanic() {
    let stress
    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].stress) {
      stress = this.beast.roleInfo[this.selectedRoleId].stress
    } else if ((this.selectedRoleId && !this.beast.roleInfo[this.selectedRoleId].stress) || !this.selectedRoleId) {
      stress = this.beast.stress
    }
    let panic
    if (this.selectedRoleId && this.beast.roleInfo[this.selectedRoleId].panic) {
      panic = this.beast.roleInfo[this.selectedRoleId].panic
    } else if ((this.selectedRoleId && !this.beast.roleInfo[this.selectedRoleId].panic) || !this.selectedRoleId) {
      panic = this.beast.panic
    }
    let percentage = .00;
    switch (panic) {
      case 1:
        return 'Always';
      case 2:
        return 1
      case 3:
        percentage = .25
        break;
      case 4:
        percentage = .5
        break;
      case 5:
        percentage = .75
        break;
      case 7:
        return 'Never'
      default: panic
    }

    return (stress * percentage).toFixed(0)
  }
}
