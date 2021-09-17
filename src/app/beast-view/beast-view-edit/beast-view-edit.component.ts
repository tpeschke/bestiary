import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import variables from '../../../local.js'
import { CalculatorService } from '../../util/services/calculator.service';
import lootTables from "../loot-tables.js"

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewEditComponent implements OnInit {

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
  public averageVitality = null;
  public lootTables = lootTables;
  public selectedRoleId = null;
  public newRole = null;

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

  ngOnInit() {
    this.route.data.subscribe(data => {
      let beast = data['beast']
      if (this.route.snapshot.params.templateId) {
        beast.variants.push({ variantid: beast.id })
        delete beast.id
        beast.name = beast.name + " Template"
        this.beast = beast
        this.beastService.getEditEncounter(this.route.snapshot.params.templateId).subscribe(encounter => {
          this.encounter = encounter
        })
      } else if (beast) {
        this.beast = beast
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
          roles: []
        }
      }
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)
      this.beast.roles.forEach(role => {
          if (role.vitality) {
            role.average = this.calculatorService.rollDice(role.vitality)
          }
      })
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })
  }

  captureHTML(event, type) {
    this.beast = Object.assign({}, this.beast, { [type]: event.html })
  }

  captureInput(event, type, index, secondaryType, thirdType) {
    if (type === 'conflict') {
      let newSecondaryObject = Object.assign({}, this.beast[type])
      newSecondaryObject[secondaryType] = [...newSecondaryObject[secondaryType]]
      newSecondaryObject[secondaryType][index][thirdType] = event.target.value
      this.beast = Object.assign({}, this.beast, { [type]: newSecondaryObject })
    } else if (!secondaryType) {
      this.beast = Object.assign({}, this.beast, { [type]: event.target.value })
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

  captureSelectForObject(event, type, secondaryType) {
    if (!event.value) {
      event.value = null
    }
    this.beast[secondaryType][type] = event.value
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

  addById() {
    if (this.newVariantId) {
      this.beast.variants.push({ variantid: this.newVariantId })
      this.newVariantId = null;
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
        dr: 0,
        shield_dr: null,
        measure: 0,
        damage: '',
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
        type: secondType.substring(0, 1)
      })
    } else if (type === 'skills') {
      this.beast[type].push({
        skill: '',
        rank: ''
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

  removeNewSecondaryItem(type, index, secondType) {
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
    this.beast.encounter = this.encounter
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
    } else {
      this.selectedRoleId = null
    }
  }

  captureNewRole (event) {
    this.newRole = event.target.value
  }

  addNewRole () {
    if (this.newRole) {
      this.beast.roles.push({name: this.newRole, id: this.makeId(), vitality: null})
      this.newRole = null
    }
  }

  captureRoleVitality(event) {
    for(let i = 0; i < this.beast.roles.length; i++) {
      if (this.beast.roles[i].id === this.selectedRoleId) {
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
}
