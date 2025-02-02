import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { Title, Meta } from "@angular/platform-browser";
import lootTables from "../loot-tables.js"
import { QuickViewService } from 'src/app/util/services/quick-view.service';
import roles from '../roles.js'
import { DisplayServiceService } from 'src/app/util/services/displayService.service';
import { MatDialog } from '@angular/material';
import { ChallengePopUpComponent } from '../../obstacle-index/view/challenge-pop-up/challenge-pop-up.component'
import { AddToListPopUpComponent } from 'src/app/random-encounters/add-to-list-pop-up/add-to-list-pop-up.component';

@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['../beast-view.component.css', './beast-view-gm.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    public router: Router,
    public titleService: Title,
    public quickViewService: QuickViewService,
    public metaService: Meta,
    public displayService: DisplayServiceService,
    private dialog: MatDialog,
  ) { }

  public beast: any = {}
  public isAllSignsTableShown = false;
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public checkboxes = []
  public locationCheckboxes: any = {}
  public trauma = 0;
  public monsterNumber = null;
  public lairLoot = []
  public lairlootpresent = false
  public lootTablesAreShow = false
  public itemCategories = {}
  public carriedLoot = []
  public carriedlootpresent = false
  public selectedRoleId = null;
  public selectedRole: any = {}
  public combatRolesInfo = roles.combatRoles.primary
  public combatSecondaryInfo = roles.combatRoles.secondary
  public socialRolesInfo = roles.socialRoles.primary
  public socialSecondaryInfo = roles.socialRoles.secondary
  public skillRolesInfo = roles.skillRoles
  public displayedVitalityRoll = null

  public selectedObstacleId = null;

  public equipmentLists = { weapons: [], armor: [], shields: [] }
  public equipmentObjects = { weapons: {}, armor: {}, shields: {} }

  public newSelectedWeapon;
  public newWeaponInfo;
  public newSelectedArmor;
  public newArmorInfo
  public newSelectedShield;
  public newShieldInfo;
  public showAllEquipment;

  public showSkillSection = true;
  public showCharacteristicsSection = true
  public aLotOfMovement = false
  public showDescriptions = false
  public showConvictions = false
  public showDevotions = false
  public showFlaws = false
  public showBurdens = false
  public isNaturalCreatureOrInsect = false;
  public isCarriedEquipmentLoading = false;
  public isLairEquipmentLoading = false;

  public groupId = null

  public tokenExists: Boolean = false
  public hasNoBaseImage = false;
  public imageUrl = null;
  public roleTokenExists: Boolean = false

  public combatStatChanges = []
  public vitalityToTransferToQuickview = null;
  public stressToTransferToQuickview = null
  public locationDamageToTransferToQuickview = {}

  public artistInfo = {}

  public modifier = null;
  public modifierDictionary = {
    'Unique': 3,
    'Greater': 5,
    'Dread': 10,
    'THE': 15
  }

  public battlefieldPatternDictionary = {
    'Open Field': 'openfield',
    'Divide': 'divide',
    'Danger Wall': 'dangerwall',
    'Pillar': 'pillar',
    'Guardian': 'guardian',
    'Pincer': 'pincer',
    'Funnel': 'funnel',
    'Horseshoe': 'horseshoe',
    'Long-Path': 'longpath',
    'Alley': 'alley',
    'Up-Hill': 'uphill',
    'King of the Hill': 'kingofthehill'
  }

  ngOnInit() {
    lootTables.itemCategories.forEach(category => {
      this.itemCategories[category.id] = category.label
    })
    this.route.data.subscribe(data => {
      this.beast = data['beast']

      this.handleImages()

      this.handleAnyBurdens()
      this.handleAnyFlaws()
      this.titleService.setTitle(`${this.beast.name} - Bestiary`)
      // this.metaService.updateTag({ name: 'og:description', content: this.beast.name });
      // this.metaService.updateTag( { name:'og:image', content: "https://bestiary.stone-fish.com/assets/preview.png" });
      this.getRandomEncounter()

      this.getLoot()

      this.beastService.getEquipment().subscribe(res => {
        this.equipmentLists = res.lists
        this.equipmentObjects = res.objects
      })

      this.isNaturalCreatureOrInsect = this.beast.types.some(typeInfo => typeInfo.typeid === 5)

      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      }

      this.determineIfSkillsShouldBeShown()
      this.determineIfCharacteristicsShouldBeShown()
      this.setDisplayVitality()
      this.setLocationalVitality()
      this.setArtistToDisplay()

      const roleParameter = this.router.url.split('/')[4]
      if (roleParameter && ['Unique', 'Greater', 'Dread', 'THE'].includes(roleParameter)) {
        this.captureSimpleInput('modifier', { value: roleParameter })
        this.setRoleToDefault()
      } else if (roleParameter) {
        this.setRoleViaParameter(roleParameter)
        const roleModifier = this.router.url.split('/')[5]
        if (roleModifier) {
          this.captureSimpleInput('modifier', { value: roleModifier })
        }
      } else {
        this.setRoleToDefault()
      }
    })
  }

  handleImages() {
    this.beastService.checkToken(this.beast.id).subscribe((res: Boolean) => {
      this.tokenExists = res
    })
    this.seeIfRoleTokenExists()
    this.getImageUrl()
  }

  seeIfRoleTokenExists() {
    this.beastService.checkToken(`${this.beast.id}${this.selectedRoleId}`).subscribe((res: Boolean) => {
      this.roleTokenExists = res
    })
  }

  getImageUrl() {
    this.imageUrl = this.imageBase + this.beast.id + (this.selectedRoleId ? `${this.selectedRoleId}` : '')
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

  getNameWithRole = () => {
    if (this.selectedRoleId) {
      return this.processNameAndRoleOrder(this.beast.name, this.beast.roleInfo[this.selectedRoleId].name, this.beast.rolenameorder ? this.beast.rolenameorder : '1')
    } else {
      return this.formatNameWithCommas(this.beast.name)
    }
  }

  formatNameWithCommas = (name) => {
    if (name.includes(',')) {
      let nameArray = name.split(', ')
      return `${nameArray[1]} ${nameArray[0]}`
    }
    return name
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

  forceDownload() {
    var xhr = new XMLHttpRequest();
    const idBase = this.roleTokenExists && this.selectedRoleId ? this.beast.id + this.selectedRoleId : this.beast.id
    const idToUse = this.tokenExists ? idBase : this.beast.imagesource
    xhr.open("GET", 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + idToUse + '-token', true);
    xhr.responseType = "blob";
    const beastName = this.roleTokenExists && this.selectedRoleId ? this.processNameAndRoleOrder(this.beast.name, this.beast.roleInfo[this.selectedRoleId].name, this.beast.rolenameorder ? this.beast.rolenameorder : '1') : this.beast.name
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

  determineIfSkillsShouldBeShown = () => {
    if (!this.selectedRoleId) {
      this.showSkillSection = this.beast.skills.length > 0
    } else {
      let showSkillSectionTemp = false

      for (let i = 0; i < this.beast.skills.length; i++) {
        if (this.beast.skills[i].skillroleid === this.selectedRoleId || this.beast.skills[i].allroles) {
          showSkillSectionTemp = true
          i = this.beast.skills.length
        }
      }
      this.showSkillSection = showSkillSectionTemp
    }
  }

  determineIfAlotOfMovement = () => {
    if (!this.selectedRoleId) {
      this.aLotOfMovement = this.beast.movement.length > 3
    } else {
      let movementCount = 0
      this.aLotOfMovement = false
      for (let i = 0; i < this.beast.movement.length; i++) {
        if (this.beast.movement[i].roleid === this.selectedRoleId || this.beast.movement[i].allroles) {
          movementCount++
          if (movementCount > 3) {
            this.aLotOfMovement = true
            i = this.beast.movement.length
          }
        }
      }
    }
  }

  determineIfCharacteristicsShouldBeShown = () => {
    if (!this.selectedRoleId) {
      this.showDescriptions = this.beast.conflict.descriptions.length > 0
      this.showConvictions = this.beast.conflict.convictions.length > 0
      this.showDevotions = this.beast.conflict.devotions.length > 0
      this.showFlaws = this.beast.conflict.flaws.length > 0
      this.showBurdens = this.beast.conflict.burdens.length > 0
    } else {
      this.showDescriptions = false
      this.showConvictions = false
      this.showDevotions = false
      this.showFlaws = false
      this.showBurdens = false

      for (let i = 0; i < this.beast.conflict.descriptions.length; i++) {
        if (this.beast.conflict.descriptions[i].socialroleid === this.selectedRoleId || this.beast.conflict.descriptions[i].allroles) {
          this.showDescriptions = true
          i = this.beast.conflict.descriptions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.convictions.length; i++) {
        if (this.beast.conflict.convictions[i].socialroleid === this.selectedRoleId || this.beast.conflict.convictions[i].allroles) {
          this.showConvictions = true
          i = this.beast.conflict.convictions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.devotions.length; i++) {
        if (this.beast.conflict.devotions[i].socialroleid === this.selectedRoleId || this.beast.conflict.devotions[i].allroles) {
          this.showDevotions = true
          i = this.beast.conflict.devotions.length
        }
      }

      for (let i = 0; i < this.beast.conflict.flaws.length; i++) {
        if (this.beast.conflict.flaws[i].socialroleid === this.selectedRoleId || this.beast.conflict.flaws[i].allroles) {
          this.showFlaws = true
          i = this.beast.conflict.flaws.length
        }
      }

      for (let i = 0; i < this.beast.conflict.burdens.length; i++) {
        if (this.beast.conflict.burdens[i].socialroleid === this.selectedRoleId || this.beast.conflict.burdens[i].allroles) {
          this.showBurdens = true
          i = this.beast.conflict.burdens.length
        }
      }

    }

    this.showCharacteristicsSection = this.showDescriptions || this.showConvictions || this.showDevotions || this.showBurdens || this.showFlaws
  }

  handleAnyFlaws = () => {
    let anyCount = 0
    this.beast.conflict.flaws.forEach(flaw => flaw.trait === 'Any' ? anyCount++ : null)
    if (anyCount) {
      this.beastService.getAnyFlaws(anyCount).subscribe((result: any[]) => {
        this.beast.conflict.flaws.map(flaw => {
          if (flaw.trait === 'Any') {
            let rolledflaw = result.shift().title
            flaw.trait = `${rolledflaw}`
          }
          return flaw
        })
        this.beast.conflict.flaws = this.beast.conflict.flaws.sort((a, b) => +b.value - +a.value)
      })
    }
  }

  handleAnyBurdens = () => {
    let anyCount = 0
    this.beast.conflict.burdens = this.beast.conflict.burdens.map(burden => {
      burden.trait === 'Any' ? anyCount++ : null
      const chance = Math.floor(Math.random() * 100);
      const isRandom = +burden.value === 1
      const isHigh = +burden.value === 2
      const isMed = +burden.value === 3
      const isLow = +burden.value === 4
      if ((isRandom && chance > 33 && chance <= 66) || (isMed && chance >= 50) || (isLow && chance >= 50)) {
        burden.severity = 'Minor'
      } else if ((isRandom && chance > 66 && chance <= 100) || isHigh || (isMed && chance < 50)) {
        burden.severity = 'Major'
      } else {
        burden.severity = null
      }
      return burden
    })
    if (anyCount) {
      let newBurdenArray = []
      this.beastService.getAnyBurdens(anyCount).subscribe((result: any[]) => {
        this.beast.conflict.burdens.forEach(burden => {
          if (burden.trait === 'Any') {
            let rolledBurden = result.shift().ib
            burden.trait = `${rolledBurden.ib}`
          }
          if (burden.severity) {
            newBurdenArray.push(burden)
          }
        })
        this.beast.conflict.burden = newBurdenArray
      })
    }
    this.beast.conflict.burdens = this.beast.conflict.burdens.sort((a, b) => +b.trait - +a.trait)
  }

  setArtistToDisplay = () => {
    let { artist, tooltip, link, roleartists } = this.beast.artistInfo
    if (this.selectedRoleId) {
      const roleIndex = roleartists.findIndex(role => role.roleid === this.selectedRoleId)
      if (roleIndex > -1 && roleartists[roleIndex].artist) {
        let { artist, tooltip, link } = roleartists[roleIndex]
        this.artistInfo = { artist, tooltip, link }
      } else if (artist) {
        this.artistInfo = { artist, tooltip, link }
      } else {
        this.artistInfo = {}
      }
    } else if (artist) {
      this.artistInfo = { artist, tooltip, link }
    } else {
      this.artistInfo = {}
    }
  }

  setLocationalVitality = () => {
    if (this.beast.locationalvitality.length > 0) {
      this.beast.locationalvitality = this.beast.locationalvitality.map(location => {
        location.average = this.calculatorService.calculateAverageOfDice(location.vitality)
        location.rolled = this.calculatorService.rollDice(location.vitality)
        return location
      })
    }
  }

  findWhatToDisplay = (object, key, toReturn = 'N/A') => {
    const thisToDisplay = this.selectedRoleId ? this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress[object][key] : this.beast.phyiscalAndStress[object][key]
    if (thisToDisplay === 'N') {
      return toReturn
    }
    return thisToDisplay
  }

  setDisplayVitality = () => {
    if (this.selectedRoleId) {
      let diceToRoll = this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress.physical.diceString
      if (diceToRoll.includes('(KB')) {
        diceToRoll = diceToRoll.split('(')[0]
      }
      this.displayedVitalityRoll = this.calculatorService.rollDice(diceToRoll)
      this.trauma = +(this.beast.roleInfo[this.selectedRoleId].phyiscalAndStress.physical.largeweapons / 4).toFixed(0)
    } else {
      let diceToRoll = this.beast.phyiscalAndStress.physical.diceString
      if (diceToRoll.includes('(KB')) {
        diceToRoll = diceToRoll.split('(')[0]
      }
      this.displayedVitalityRoll = this.calculatorService.rollDice(diceToRoll)
      this.trauma = +(this.beast.phyiscalAndStress.physical.largeweapons / 4).toFixed(0)
    }
  }

  setMonsterNumber = (event) => {
    if (+event.target.value < 1) {
      event.target.value = 1
    } else if (+event.target.value > 25) {
      event.target.value = 25
    }
    this.monsterNumber = +event.target.value
  }

  getLoot() {
    const lairLoot = this.getLairLoot()
    const carriedLoot = this.getCarriedLoot()

    setTimeout(_ => {
      this.beastService.getTreasure({ requestArray: [lairLoot, carriedLoot] }).subscribe(treasure => {
        this.isCarriedEquipmentLoading = false;
        this.isLairEquipmentLoading = false;
        this.lairLoot = [...this.lairLoot, ...treasure[0]]
        this.carriedLoot = [...this.carriedLoot, ...treasure[1]]
      })
    }, 10000)
  }

  getLairLoot() {
    this.lairLoot = []
    let lootToRequest: any = {}
    let timesToRoll = this.monsterNumber ? this.monsterNumber : 1;
    let { copper, enchanted, potion, items, scrolls, alms, talisman } = this.beast.lairloot

    this.lairlootpresent = copper || enchanted || potion || talisman || items.length > 0 || scrolls > 0 || alms > 0

    const monsterMax = Math.max(this.beast.combatpoints, this.beast.socialpoints, this.beast.skillpoints)

    if (enchanted) {
      let numberOfItems = 0
      const baseChance = this.generateEnchantedItem(monsterMax, enchanted)
      for (let i = 0; i < timesToRoll; i++) {
        let enchantedChance = Math.floor(Math.random() * 101);
        if (baseChance >= enchantedChance) {
          numberOfItems++
        }
      }
      if (numberOfItems > 0) {
        lootToRequest.enchanted = { numberOfItems }
      }
    }

    if (items.length > 0) {
      let itemArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < items.length; i++) {
          const { number, chance, detailing, itemcategory, materialrarity, wear } = items[i]
          const baseChance = this.generateUniqueItem(monsterMax, chance)
          for (let n = 0; n < number; n++) {
            if (this.calculatorService.rollDice('1d100') <= baseChance) {
              this.isLairEquipmentLoading = true
              itemArray.push({ detailing, itemcategory, materialrarity, wear: wear.split('d')[1] })
            }
          }
        }
      }
      if (itemArray.length > 0) {
        lootToRequest.items = { itemArray }
      }
    }

    if (alms.length > 0) {
      for (let i = 0; i < timesToRoll; i++) {
        for (let x = 0; x < alms.length; x++) {
          const favor = this.generateScriptFavor(monsterMax, alms[x].favor)
            , number = this.generateScriptNumber(monsterMax, alms[x].number)
          if (number > 0) {
            this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
          }
        }
      }
    }

    if (scrolls.length > 0) {
      let scrollsArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < scrolls.length; i++) {
          const power = this.generateScrollPower(monsterMax, scrolls[i].power)
            , numberOfItems = this.generateScriptNumber(monsterMax, scrolls[i].number)
          if (numberOfItems > 0) {
            scrollsArray.push({ numberOfItems, power })
          }
        }
      }
    }

    if (potion) {
      let numberOfItems = 0
      for (let i = 0; i < timesToRoll; i++) {
        numberOfItems += this.generatePotion(monsterMax, potion)
      }
      if (numberOfItems > 0) {
        lootToRequest.potions = { numberOfItems }
      }
    }

    if (talisman) {
      let numberOfItems = 0
      for (let i = 0; i < timesToRoll; i++) {
        numberOfItems += this.generateTalisman(monsterMax, talisman)
      }
      if (numberOfItems > 0) {
        lootToRequest.talismans = { numberOfItems }
      }
    }

    if (copper) {
      let coinNumber = []
      for (let i = 0; i < timesToRoll; i++) {
        const coinArray = this.generateCoin(monsterMax, copper);
        coinNumber[0] += coinArray[0]
        coinNumber[1] += coinArray[1]
        coinNumber[2] += coinArray[2]
      }
      if (coinNumber[0] > 0) {
        this.lairLoot.push(coinNumber[0] + " gc in coin")
      }
      if (coinNumber[1] > 0) {
        this.lairLoot.push(coinNumber[1] + " sc in coin")
      }
      if (coinNumber[2] > 0) {
        this.lairLoot.push(coinNumber[2] + " cc in coin")
      }
    }

    return lootToRequest
  }

  getCarriedLoot() {
    this.carriedLoot = []
    let lootToRequest: any = {}
    let timesToRoll = this.monsterNumber ? this.monsterNumber : 1;
    let { copper, enchanted, potion, items, scrolls, alms, talisman } = this.beast.carriedloot

    this.carriedlootpresent = copper || enchanted || potion || talisman || items.length > 0 || scrolls > 0 || alms > 0

    const monsterMax = Math.max(this.beast.combatpoints, this.beast.socialpoints, this.beast.skillpoints)

    if (enchanted) {
      let numberOfItems = 0
      const baseChance = this.generateEnchantedItem(monsterMax, enchanted) * 2
      for (let i = 0; i < timesToRoll; i++) {
        let enchantedChance = Math.floor(Math.random() * 101);
        if (baseChance >= enchantedChance) {
          numberOfItems++
        }
      }
      if (numberOfItems > 0) {
        lootToRequest.enchanted = { numberOfItems }
      }
    }

    if (items.length > 0) {
      let itemArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < items.length; i++) {
          const { number, chance, detailing, itemcategory, materialrarity, wear } = items[i]
          const baseChance = this.generateUniqueItem(monsterMax, chance) * 3
          for (let n = 0; n < number; n++) {
            if (this.calculatorService.rollDice('1d100') <= baseChance) {
              this.isLairEquipmentLoading = true
              itemArray.push({ detailing, itemcategory, materialrarity, wear: wear.split('d')[1] })
            }
          }
        }
      }
      if (itemArray.length > 0) {
        lootToRequest.items = { itemArray }
      }
    }

    if (alms.length > 0) {
      for (let i = 0; i < timesToRoll; i++) {
        for (let x = 0; x < alms.length; x++) {
          const favor = this.generateScriptFavor(monsterMax, alms[x].favor)
            , number = this.generateScriptNumber(monsterMax, alms[x].number)
          if (number > 0) {
            this.lairLoot.push(`${number} alm script${number > 1 ? 's' : ''} (${favor} Favor)`)
          }
        }
      }
    }

    if (scrolls.length > 0) {
      let scrollsArray = []
      for (let y = 0; y < timesToRoll; y++) {
        for (let i = 0; i < scrolls.length; i++) {
          const power = this.generateScrollPower(monsterMax, scrolls[i].power)
            , numberOfItems = this.generateScrollNumber(monsterMax, scrolls[i].number)
          if (numberOfItems > 0) {
            scrollsArray.push({ numberOfItems, power })
          }
        }
      }
    }

    if (potion) {
      let numberOfItems = 0
      for (let i = 0; i < timesToRoll; i++) {
        numberOfItems += this.generatePotion(monsterMax, potion) * 3
      }
      if (numberOfItems > 0) {
        lootToRequest.potions = { numberOfItems }
      }
    }

    if (talisman) {
      let numberOfItems = 0
      for (let i = 0; i < timesToRoll; i++) {
        numberOfItems += this.generateTalisman(monsterMax, talisman) * 3
      }
      if (numberOfItems > 0) {
        lootToRequest.talismans = { numberOfItems }
      }
    }

    if (copper) {
      let coinNumber = []
      for (let i = 0; i < timesToRoll; i++) {
        const coinArray = this.generateCoin(monsterMax, copper);
        coinNumber[0] += coinArray[0]
        coinNumber[1] += coinArray[1]
        coinNumber[2] += coinArray[2]
      }
      if (coinNumber[0] > 0) {
        this.lairLoot.push(coinNumber[0] * 3 + " gc in coin")
      }
      if (coinNumber[1] > 0) {
        this.lairLoot.push(coinNumber[1] * 3 + " sc in coin")
      }
      if (coinNumber[2] > 0) {
        this.lairLoot.push(coinNumber[2] * 3 + " cc in coin")
      }
    }

    return lootToRequest
  }

  generateCoin = (monsterMax, frequency) => {
    let { coinScaling } = lootTables
    const coinAmount = (this.calculatorService.rollDice('1d6') + this.calculatorService.rollDice('1d6')) * this.calculatorService.rollDice('1d20')

    const isNonScaling = frequency === coinScaling.e || frequency === coinScaling.f || frequency === coinScaling.g

    let finalCoinAmount = 0
    if (isNonScaling) {
      finalCoinAmount = coinAmount * coinScaling[frequency]
    } else {
      finalCoinAmount = coinAmount * (monsterMax + 1) * coinScaling[frequency]
    }

    const gold = Math.floor(finalCoinAmount / 100)
      , silver = Math.floor(finalCoinAmount / 10) - (gold * 10)
      , copper = finalCoinAmount - (gold * 100) - (silver * 10)

    return [gold, silver, copper]
  }

  generateEnchantedItem = (monsterMax, frequency) => {
    let { enchantedItemChanceScaling } = lootTables
    const isNonScaling = frequency === enchantedItemChanceScaling.e || frequency === enchantedItemChanceScaling.f || frequency === enchantedItemChanceScaling.g

    let finalChance = 0
    if (isNonScaling) {
      finalChance = enchantedItemChanceScaling[frequency]
    } else {
      finalChance = (monsterMax + 1) * enchantedItemChanceScaling[frequency]
    }

    return finalChance
  }

  generateUniqueItem = (monsterMax, frequency) => {
    let { uniqueItemChanceScaling } = lootTables
    const isNonScaling = frequency === uniqueItemChanceScaling.e || frequency === uniqueItemChanceScaling.f || frequency === uniqueItemChanceScaling.g

    let finalChance = 0
    if (isNonScaling) {
      finalChance = uniqueItemChanceScaling[frequency]
    } else {
      finalChance = (monsterMax + 1) * uniqueItemChanceScaling[frequency]
    }

    return finalChance
  }

  generateScriptNumber = (monsterMax, frequency) => {
    let { talismanPotionScrollAlmScriptScaling } = lootTables
    const scrollAmount = this.calculatorService.rollDice('1d8') - 2
    const isNonScaling = frequency === talismanPotionScrollAlmScriptScaling.e || frequency === talismanPotionScrollAlmScriptScaling.f || frequency === talismanPotionScrollAlmScriptScaling.g

    const monsterAmountModifier = 4 - (Math.floor(monsterMax / 5))

    if (isNonScaling) {
      return Math.max(scrollAmount + talismanPotionScrollAlmScriptScaling[frequency], 0)
    } else {
      return Math.max((scrollAmount + talismanPotionScrollAlmScriptScaling[frequency]) - monsterAmountModifier, 0)
    }
  }

  generateScriptFavor = (monsterMax, frequency) => {
    let { spellPointsFavorScaling } = lootTables
    const spAmount = this.calculatorService.rollDice('1d3')

    const isNonScaling = frequency === spellPointsFavorScaling.e || frequency === spellPointsFavorScaling.f || frequency === spellPointsFavorScaling.g

    const monsterAmountModifier = Math.floor(monsterMax / 5)

    if (isNonScaling) {
      return Math.max(Math.floor(spAmount * spellPointsFavorScaling[frequency]), 1)
    } else {
      return Math.max((Math.floor(spAmount * spellPointsFavorScaling[frequency])) + monsterAmountModifier, 1)
    }
  }

  generateScrollNumber = (monsterMax, frequency) => {
    let { talismanPotionScrollAlmScriptScaling } = lootTables
    const scrollAmount = this.calculatorService.rollDice('1d8') - 3

    const isNonScaling = frequency === talismanPotionScrollAlmScriptScaling.e || frequency === talismanPotionScrollAlmScriptScaling.f || frequency === talismanPotionScrollAlmScriptScaling.g

    const monsterAmountModifier = 4 - (Math.floor(monsterMax / 5))

    if (isNonScaling) {
      return Math.max(scrollAmount + talismanPotionScrollAlmScriptScaling[frequency], 0)
    } else {
      return Math.max((scrollAmount + talismanPotionScrollAlmScriptScaling[frequency]) - monsterAmountModifier, 0)
    }
  }

  generateScrollPower = (monsterMax, frequency) => {
    let { spellPointsFavorScaling } = lootTables
    const spAmount = Math.floor(Math.random() * (10 - 5 + 1) + 5);

    const isNonScaling = frequency === spellPointsFavorScaling.e || frequency === spellPointsFavorScaling.f || frequency === spellPointsFavorScaling.g

    if (isNonScaling) {
      return Math.max(Math.floor(spAmount * spellPointsFavorScaling[frequency]), 5)
    } else {
      return Math.max((Math.floor(spAmount * spellPointsFavorScaling[frequency])) + monsterMax, 5)
    }
  }

  generatePotion = (monsterMax, frequency) => {
    let { talismanPotionScrollAlmScriptScaling } = lootTables
    const talismanAmount = this.calculatorService.rollDice('1d8') - 4
    const isNonScaling = frequency === talismanPotionScrollAlmScriptScaling.e || frequency === talismanPotionScrollAlmScriptScaling.f || frequency === talismanPotionScrollAlmScriptScaling.g

    const monsterModifier = 4 - (Math.floor(monsterMax / 5))

    let finalTalismanAmount = 0
    if (isNonScaling) {
      finalTalismanAmount = Math.max(talismanAmount + talismanPotionScrollAlmScriptScaling[frequency], 0)
    } else {
      finalTalismanAmount = Math.max((talismanAmount + talismanPotionScrollAlmScriptScaling[frequency]) - monsterModifier, 0)
    }

    return finalTalismanAmount
  }

  generateTalisman = (monsterMax, frequency) => {
    let { talismanPotionScrollAlmScriptScaling } = lootTables
    const talismanAmount = this.calculatorService.rollDice('1d8') - 4

    const isNonScaling = frequency === talismanPotionScrollAlmScriptScaling.e || frequency === talismanPotionScrollAlmScriptScaling.f || frequency === talismanPotionScrollAlmScriptScaling.g

    const monsterModifier = 4 - (Math.floor(monsterMax / 5))

    let finalTalismanAmount = 0
    if (isNonScaling) {
      finalTalismanAmount = Math.max(talismanAmount + talismanPotionScrollAlmScriptScaling[frequency], 0)
    } else {
      finalTalismanAmount = Math.max((talismanAmount + talismanPotionScrollAlmScriptScaling[frequency]) - monsterModifier, 0)
    }

    return finalTalismanAmount
  }

  navigateToSearch(type, search) {
    this.router.navigate(['/search', { [type]: search }]);
  }

  isNumber(val): boolean {
    return !isNaN(+val);
  }

  addFavorite(beastid) {
    this.beastService.addFavorite(beastid).subscribe(result => {
      if (result.message === 'Monster Favorited') {
        this.beast.favorite = true
      }
    })
  }

  deleteFavorite(beastid) {
    this.beastService.deleteFavorite(beastid).subscribe(_ => {
      this.beast.favorite = false
    })
  }

  getRandomEncounter() {
    this.encounter = 'loading'
    this.beastService.getRandomEncounter(this.beast.id, this.groupId).subscribe((result: any) => {
      if (result.main) {
        let distance = 0
        if (result.complication) {

          result.complication.forEach(complication => {
            if (complication.id === 1) {
              if (complication.rival.number) {
                complication.rival.number = this.calculatorService.rollDice(complication.rival.number)
              } else {
                complication.rival.number = this.calculatorService.rollDice(`${complication.rival.number_min}d${complication.rival.number_max}`)
              }
              if (complication.rival.number < complication.rival.number_min) {
                complication.rival.number = complication.rival.number_min
              }
              if (complication.rival.number === 0) {
                complication.rival.number = 1
              }
            } else if (complication.id === 5) {
              distance = distance + this.calculatorService.rollDice(complication.distance)
            } else if (complication.id === 8) {
              complication.time = this.calculatorService.rollDice(complication.time) + " seconds"
              if (complication.backup.number) {
                complication.backup.number = this.calculatorService.rollDice(complication.backup.number)
              } else {
                complication.backup.number = this.calculatorService.rollDice(`${complication.backup.number_min}d${complication.rival.number_max}`)
              }
            }
          })
        }

        result.main.milesFromLair = distance > 0 ? distance : result.main.milesFromLair
        result.timeOfDay = this.calculatorService.rollDice(8) / 2
      }
      this.encounter = result
    })
  }

  getIDDifficulty(difficulty, rarity) {
    if (difficulty.toUpperCase() === 'N/A') {
      return 'N/A'
    }
    const rarityModifier = this.getRarityModifier(rarity) !== '0' ? '+' + this.getRarityModifier(rarity) : ''
    return '+' + difficulty + rarityModifier
  }

  getHarvest(difficulty, harvest) {
    if (!harvest) {
      harvest = difficulty
    }
    if (harvest.toUpperCase() === 'N/A') {
      return 'N/A'
    } else {
      return '+' + harvest
    }
  }

  handleReagentPrice(harvest, difficulty) {
    if (!harvest) {
      harvest = difficulty
    }
    if (difficulty && difficulty.toUpperCase() === 'N/A' && harvest && harvest.toUpperCase() === 'N/A') {
      return 'Priceless'
    }
    if (!difficulty || difficulty.toUpperCase() === 'N/A') {
      difficulty = 0
    }
    if (harvest.toUpperCase() === 'N/A') {
      harvest = 0
    }

    let harvestAndDifficulty = this.calculatorService.calculateAverageOfDice(harvest + "+" + difficulty + '+' + this.getRarityModifier(this.beast.rarity))
      , justDifficulty = this.calculatorService.calculateAverageOfDice(difficulty + "+" + difficulty + '+' + this.getRarityModifier(this.beast.rarity))
      , price;
    if (harvestAndDifficulty === 0) {
      price = 5
    } else {
      price = harvestAndDifficulty * 2
    }

    return price + ' sc'
  }

  getUrl(id) {
    return `https://bestiary.stone-fish.com/beast/${id}/gm`
  }

  getRarityModifier(rarity) {
    switch (+rarity) {
      case 1:
        return '2d20!';
      case 3:
        return 'd20!';
      case 5:
        return 'd10!';
      case 10:
        return '0';
      default:
        return ' nothing'
    }
  }

  setRoleToDefault() {
    if (!this.beast.defaultrole && this.beast.roles.length > 0) {
      this.beast.defaultrole = this.beast.roles[0].id
    }

    if (this.beast.defaultrole) {
      this.setRole({ value: this.beast.defaultrole })
    }
  }

  setRoleViaParameter(param) {
    let uppercaseParam = param.toUpperCase()
    for (let i = 0; i < this.beast.roles.length; i++) {
      let role = this.beast.roles[i]
      if (role.name.replace(/\s|-/g, '').toUpperCase() === uppercaseParam || param === role.id) {
        this.setRole({ value: role.id })
      }
    }
  }

  setGroupParam(event) {
    this.groupId = event.value
    this.getRandomEncounter()
  }

  setRole(event) {
    if (event.value) {
      this.selectedRoleId = event.value
      if (this.beast.roleInfo[this.selectedRoleId].role) {
        this.selectedRole = this.combatRolesInfo[this.beast.roleInfo[this.selectedRoleId].role]
      } else {
        this.selectedRole = {}
      }
    } else {
      this.selectedRoleId = null
      if (this.beast.role) {
        this.selectedRole = this.combatRolesInfo[this.beast.role]
      } else {
        this.selectedRole = {}
      }
    }

    this.setArtistToDisplay()
    this.getImageUrl()
    this.seeIfRoleTokenExists()

    this.determineIfSkillsShouldBeShown()
    this.determineIfCharacteristicsShouldBeShown()
    this.determineIfAlotOfMovement()

    this.setDisplayVitality()
  }

  captureSimpleInput(key, event) {
    if (event.target) {
      this[key] = event.target.value
    } else {
      this[key] = event.value
      if (key === 'modifier') {
        this.beast.combatStatArray.forEach((combatSquare, index) => {
          combatSquare.combatStats.modifier = this.modifier
          const roleid = combatSquare.roleid
          const combatpoints = (roleid ? this.beast.roleInfo[roleid].combatpoints : this.beast.combatpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
          const size = roleid && this.beast.roleInfo[roleid].size ? this.beast.roleInfo[roleid].size : this.beast.size ? this.beast.size : 'Medium'
          const primaryRole = roleid ? this.beast.roleInfo[roleid].role : this.beast.role
          this.beastService.getCombatSquare(combatSquare.combatStats, primaryRole, combatpoints, size).subscribe(res => {
            const fullCombatSquare = { ...combatSquare.combatSquare, ...res }
            const newCombatSquare = { ...combatSquare, combatSquare: fullCombatSquare }
            this.beast.combatStatArray[index] = newCombatSquare
          })
        })

        this.beast.roles.forEach((role, index) => {
          const roleid = role.id
          const roleInfo = this.beast.roleInfo[roleid]
          const size = roleInfo.size ? roleInfo.size : this.beast.size ? this.beast.size : 'Medium'
          const knockback = roleInfo.knockback ? roleInfo.knockback : this.beast.knockback
          const combatStats = {
            panic: roleInfo ? roleInfo.panic : this.beast.panic,
            mental: roleInfo ? roleInfo.mental : this.beast.mental,
            caution: roleInfo ? roleInfo.caution : this.beast.caution,
            largeweapons: roleInfo ? roleInfo.largeweapons : this.beast.largeweapons,
            fatigue: roleInfo ? roleInfo.fatigue : this.beast.fatigue,
            singledievitality: roleInfo ? roleInfo.singledievitality : this.beast.singledievitality,
            isincorporeal: roleInfo ? roleInfo.isincorporeal : this.beast.isincorporeal,
            weaponbreakagevitality: roleInfo ? roleInfo.weaponbreakagevitality : this.beast.weaponbreakagevitality,
            noknockback: roleInfo ? roleInfo.noknockback : this.beast.noknockback
          }
          const combatpoints = (roleInfo ? roleInfo.combatpoints : this.beast.combatpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
          const skillpoints = (roleInfo ? roleInfo.skillpoints : this.beast.skillpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
          const socialpoints = (roleInfo ? roleInfo.socialpoints : this.beast.socialpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
          const primaryrole = roleInfo ? roleInfo.role : this.beast.role
          const secondaryrole = roleInfo ? roleInfo.secondaryrole : this.beast.secondaryrole
          this.beastService.getVitalityAndStress(combatpoints, Math.max(combatpoints, skillpoints, socialpoints), primaryrole, combatStats, secondaryrole, knockback, size, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].armor : null, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].shield : null).subscribe(newPhyiscalAndStress => {
            this.beast.roleInfo[roleid].phyiscalAndStress = newPhyiscalAndStress
            if (roleid === this.selectedRoleId) {
              this.setDisplayVitality()
            }
          })
        })

        const size = this.beast.size ? this.beast.size : 'Medium'
        const knockback = this.beast.knockback
        const combatStats = {
          panic: this.beast.panic,
          mental: this.beast.mental,
          caution: this.beast.caution,
          largeweapons: this.beast.largeweapons,
          fatigue: this.beast.fatigue,
          singledievitality: this.beast.singledievitality,
          isincorporeal: this.beast.isincorporeal,
          weaponbreakagevitality: this.beast.weaponbreakagevitality,
          noknockback: this.beast.noknockback
        }
        const combatpoints = this.beast.combatpoints + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
        const skillpoints = this.beast.skillpoints + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
        const socialpoints = this.beast.socialpoints + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
        const primaryrole = this.beast.role
        const secondaryrole = this.beast.secondaryrole
        this.beastService.getVitalityAndStress(combatpoints, Math.max(combatpoints, skillpoints, socialpoints), primaryrole, combatStats, secondaryrole, knockback, size, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].armor : null, this.beast.combatStatArray[0] ? this.beast.combatStatArray[0].shield : null).subscribe(newPhyiscalAndStress => {
          this.beast.phyiscalAndStress = newPhyiscalAndStress
          if (!this.selectedRoleId) {
            this.setDisplayVitality()
          }
        })

        const newMovements = this.beast.movement.map(movementType => {
          const points = (movementType.roleid ? this.beast.roleInfo[movementType.roleid].combatpoints : this.beast.combatpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
          const role = movementType.roleid ? this.beast.roleInfo[movementType.roleid].role : this.beast.role
          movementType.role = role
          movementType.points = points

          return movementType
        })

        this.beastService.getMovement(newMovements).subscribe(res => {
          this.beast.movement = res
        })

        // Skills and Characteristics are calculated dynamically on the front end so don't need to specifically be updated in the same way the combat squares do
      }
    }
  }

  captureLocationVitalityInput(location, event) {
    this.locationDamageToTransferToQuickview[location.id] = +event.target.value
  }

  addToQuickView() {
    let hash = this.beast.hash
    if (this.selectedRoleId) {
      hash = this.beast.roleInfo[this.selectedRoleId].hash
    }
    this.quickViewService.addToQuickViewArray(hash, { combat: this.combatStatChanges, physicalMental: { currentDamage: this.vitalityToTransferToQuickview, currentStress: this.stressToTransferToQuickview, locationalDamage: this.locationDamageToTransferToQuickview }, modifiers: { pointModifier: this.modifier ? this.modifierDictionary[this.modifier] : 0, modifierTerm: this.modifier } })
  }

  setEquipmentChangesUnbound(combatInfo) {
    if (this.combatStatChanges.length === 0) {
      this.combatStatChanges.push(combatInfo)
    } else {
      const index = this.combatStatChanges.findIndex(i => i.id === combatInfo.id)
      if (index === -1) {
        this.combatStatChanges.push(combatInfo)
      } else {
        this.combatStatChanges[index] = combatInfo
      }
    }
  }

  setEquipmentChanges = this.setEquipmentChangesUnbound.bind(this)

  toggleEquipmentSelection = (square) => {
    if (!square.showEquipmentSelection) {
      this.newSelectedWeapon = square.selectedweapon
      this.newWeaponInfo = square.weaponInfo
      this.newWeaponInfo.weapontype = square.weapontype
      this.newSelectedArmor = square.selectedarmor
      this.newArmorInfo = square.armorInfo
      this.newSelectedShield = square.selectedshield
      this.newShieldInfo = square.shieldInfo
      // this.showAllEquipment = this.displayService.turnOnAllEquipment(this.beast.roleInfo, this.newSelectedWeapon, this.newSelectedArmor, this.newSelectedShield)
    } else if (square.showEquipmentSelection) {
      square.selectedweapon = this.newSelectedWeapon

      square.weaponInfo = this.newWeaponInfo
      if (square.weaponInfo.range) {
        square.weapontype = 'r'
        if (!square.ranges) {
          square.ranges = { increment: 0 }
        }
      } else {
        square.weapontype = 'm'
      }
      square.selectedarmor = this.newSelectedArmor
      square.armorInfo = this.newArmorInfo
      square.selectedshield = this.newSelectedShield
      square.shieldInfo = this.newShieldInfo
    }
    square.showEquipmentSelection = !square.showEquipmentSelection
  }

  toggleLootTables = () => {
    this.lootTablesAreShow = !this.lootTablesAreShow
  }

  backoutOfEquipmentSelection = (square) => {
    this.newSelectedWeapon = null
    this.newWeaponInfo = null
    this.newSelectedArmor = null
    this.newArmorInfo = null
    this.newSelectedShield = null
    this.newShieldInfo = null
    this.showAllEquipment = false
    square.showEquipmentSelection = false
  }

  captureEquipmentChange = ({ value }, type) => {
    if (value === 'None') { value = null }
    if (type === 'selectedweapon') {
      this.newSelectedWeapon = value
      this.newWeaponInfo = this.equipmentObjects.weapons[value]
      if (this.newWeaponInfo && this.newWeaponInfo.range) {
        this.newWeaponInfo.weapontype = 'r'
      } else if (this.newWeaponInfo) {
        this.newWeaponInfo.weapontype = 'm'
      } else {
        this.newWeaponInfo = { weapontype: 'm' }
      }
    } else if (type === 'selectedarmor') {
      this.newSelectedArmor = value
      this.newArmorInfo = this.equipmentObjects.armor[value]
    } else if (type === 'selectedshield') {
      this.newSelectedShield = value
      this.newShieldInfo = this.equipmentObjects.shields[value]
    }
  }

  checkShowAllEquipment = (checked) => {
    this.showAllEquipment = checked
  }

  toggleAllSigns = () => {
    this.isAllSignsTableShown = !this.isAllSignsTableShown
  }

  spellPointBonus = () => {
    switch (+this.beast.rarity) {
      case 1:
        return '+32';
      case 3:
        return '+16';
      case 5:
        return '+8';
      case 10:
        return '+4';
      default:
        return '+0'
    }
  }

  spellCheckBonus = () => {
    switch (+this.beast.rarity) {
      case 1:
        return '+16';
      case 3:
        return '+8';
      case 5:
        return '+4';
      case 10:
        return '+2';
      default:
        return '+0'
    }
  }

  handleCommaInName(name) {
    if (name.includes(',')) {
      let splitname = name.split(', ')
      return `${splitname[1]} ${splitname[0]}`
    } else {
      return name
    }
  }

  createTextArea() {
    let textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    return textArea
  }

  copyURLFromTextArea(textArea, url) {
    textArea.value = url;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      this.beastService.handleMessage({ color: 'green', message: `${url} successfully copied` })
    } catch (err) {
      this.beastService.handleMessage({ color: 'red', message: `Unable to copy ${url}` })
    }

    document.body.removeChild(textArea);
  }

  getRoleShortCutURL() {
    const textArea = this.createTextArea()

    let urlArray = this.router.url.split('/')
    let url = `${window.location.origin}/beast/${urlArray[2]}/gm/${this.selectedRoleId}`
    if (this.modifier) {
      url += `/${this.modifier}`
    }

    this.copyURLFromTextArea(textArea, url)
  }

  getModifierShortCutURL() {
    const textArea = this.createTextArea()

    let urlArray = this.router.url.split('/')
    let url = `${window.location.origin}/beast/${urlArray[2]}/gm/${this.modifier}`

    this.copyURLFromTextArea(textArea, url)
  }

  getSocialRank(type, strength, adjustment = 0) {
    const socialPoints = (this.selectedRoleId ? this.beast.roleInfo[this.selectedRoleId].socialpoints : this.beast.socialpoints) + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
    return this.beastService.calculateRankForCharacteristic(type, +socialPoints, strength, adjustment)
  }

  getSkillRank(strength, adjustment = 0) {
    const skillpoints = (this.selectedRoleId ? this.beast.roleInfo[this.selectedRoleId].skillpoints : this.beast.skillpoints) + + (this.modifier ? this.modifierDictionary[this.modifier] : 0)
    return this.beastService.calculateRankForSkill(+skillpoints, strength, adjustment)
  }

  selectObstacle(obstacleId) {
    if (obstacleId === this.selectedObstacleId) {
      this.selectedObstacleId = null
    } else {
      this.selectedObstacleId = obstacleId
    }
  }

  goToEditBinded = this.goToEdit.bind(this)

  goToEdit() {
    this.router.navigate([`/obstacle/edit/${this.selectedObstacleId}`])
  }

  openChallenge(id) {
    this.dialog.open(ChallengePopUpComponent, { panelClass: 'my-class', data: { id } })
  }

  createLabel(player, roles, index) {
    const connector = this.getConnector(roles, index)
    const number = player.value.number
    const name = player.key !== 'None' ? (number === 1 ? player.key : player.key + "s") : number === 1 ? this.handleCommaInName(this.beast.name) : this.beast.plural ? this.beast.plural : this.handleCommaInName(this.beast.name) + "s"

    let modifierString = ""
    if (player.value.unique > 0) {
      if (modifierString === "") {
        modifierString = "("
      }
      modifierString += `${player.value.unique} Unique`
    }
    if (player.value.greater > 0) {
      if (modifierString === "") {
        modifierString = "("
      } else {
        modifierString += ", "
      }
      modifierString += `${player.value.greater} Greater`
    }
    if (player.value.dread > 0) {
      if (modifierString === "") {
        modifierString = "("
      } else {
        modifierString += ", "
      }
      modifierString += `${player.value.greater} Dread`
    }
    if (modifierString !== "") {
      modifierString += ")"
    }

    return `${connector} ${number} ${name}` + (modifierString !== "" ? " " + modifierString : '')
  }

  getConnector(object, index) {
    const length = Object.keys(object).length

    if (index === 0) {
      return ' '
    } else if (index < length - 1) {
      return ', '
    } else {
      return ', and '
    }
  }

  aOrAn(label) {
    var vowels = ("aeioAEIO");
    if (vowels.indexOf(label[0]) !== -1) {
      return 'An'
    }
    return 'A'
  }

  createEncounterLabel(label, roles) {
    const roleLength = Object.keys(roles).length
    if (roleLength > 1) {
      return `${this.aOrAn(label)} ${label} of`
    } else {
      let number = 0
      for (let key in roles) {
        number = roles[key].number
      }
      if (number > 1) {
        return `${this.aOrAn(label)} ${label} of`
      } else {
        return ``
      }
    }
  }

  openRandomListsPopUp() {
    this.dialog.open(AddToListPopUpComponent, { width: '400px', data: { beastid: this.beast.id, rarity: this.beast.rarity } });
  }

  goToVariant(variantid) {
    this.beast = {}
    this.isAllSignsTableShown = false;
    this.encounter = "loading";
    this.loggedIn = this.beastService.loggedIn || false;
    this.imageBase = variables.imageBase;
    this.checkboxes = []
    this.locationCheckboxes = {}
    this.trauma = 0;
    this.monsterNumber = null;
    this.lairLoot = []
    this.lairlootpresent = false
    this.carriedLoot = []
    this.carriedlootpresent = false
    this.selectedRoleId = null;
    this.selectedRole = {}
    this.combatRolesInfo = roles.combatRoles.primary
    this.combatSecondaryInfo = roles.combatRoles.secondary
    this.socialRolesInfo = roles.socialRoles.primary
    this.socialSecondaryInfo = roles.socialRoles.secondary
    this.skillRolesInfo = roles.skillRoles
    this.displayedVitalityRoll = null;

    this.equipmentLists = { weapons: [], armor: [], shields: [] }
    this.equipmentObjects = { weapons: {}, armor: {}, shields: {} }
    this.router.navigate(['/beast', variantid, 'gm'])
  }

  returnAtkDefNotation = (type) => {
    let hasAttackNotation = false;
    let hasDefenseNotation = false;
    let typeAttackKeyMain = 'sp_atk'
    let typeAttackKeyRole = 'attack'
    let typeDefenseKeyMain = 'sp_def'
    let typeDefenseKeyRole = 'defense'

    if (type === 'Skill') {
      typeAttackKeyMain = 'atk_skill'
      typeAttackKeyRole = 'attack_skill'
      typeDefenseKeyMain = 'def_skill'
      typeDefenseKeyRole = 'defense_skill'
    } else if (type === 'Confrontation') {
      typeAttackKeyMain = 'atk_conf'
      typeAttackKeyRole = 'attack_conf'
      typeDefenseKeyMain = 'def_conf'
      typeDefenseKeyRole = 'defense_conf'
    }

    this.beast[typeAttackKeyMain] && (this.beast[typeAttackKeyMain] !== 'None' || this.beast[typeAttackKeyMain] !== 'None.') ? hasAttackNotation = true : null
    this.beast[typeDefenseKeyMain] && (this.beast[typeDefenseKeyMain] !== 'None' || this.beast[typeDefenseKeyMain] !== 'None.') ? hasDefenseNotation = true : null

    if (this.selectedRoleId) {
      const currentdRole = this.beast.roleInfo[this.selectedRoleId]
      currentdRole[typeAttackKeyRole] && (currentdRole[typeAttackKeyRole] !== 'None' || currentdRole[typeAttackKeyRole] !== 'None.') ? hasAttackNotation = true : null
      currentdRole[typeDefenseKeyRole] && (currentdRole[typeDefenseKeyRole] !== 'None' || this.beast[typeDefenseKeyRole] !== 'None.') ? hasDefenseNotation = true : null
    }

    if (hasAttackNotation && hasDefenseNotation) {
      return 'AD'
    } else if (hasAttackNotation) {
      return 'A'
    } else if (hasDefenseNotation) {
      return 'D'
    }
  }

  returnAtkDefTooltip = (type) => {
    let hasAttackTooltip = false;
    let hasDefenseTooltip = false;
    let typeAttackKeyMain = 'sp_atk'
    let typeAttackKeyRole = 'attack'
    let typeDefenseKeyMain = 'sp_def'
    let typeDefenseKeyRole = 'defense'

    if (type === 'Skill') {
      typeAttackKeyMain = 'atk_skill'
      typeAttackKeyRole = 'attack_skill'
      typeDefenseKeyMain = 'def_skill'
      typeDefenseKeyRole = 'defense_skill'
    } else if (type === 'Confrontation') {
      typeAttackKeyMain = 'atk_conf'
      typeAttackKeyRole = 'attack_conf'
      typeDefenseKeyMain = 'def_conf'
      typeDefenseKeyRole = 'defense_conf'
    }

    this.beast[typeAttackKeyMain] && (this.beast[typeAttackKeyMain] !== 'None' || this.beast[typeAttackKeyMain] !== 'None.') ? hasAttackTooltip = true : null
    this.beast[typeDefenseKeyMain] && (this.beast[typeDefenseKeyMain] !== 'None' || this.beast[typeDefenseKeyMain] !== 'None.') ? hasDefenseTooltip = true : null

    if (this.selectedRoleId) {
      const currentdRole = this.beast.roleInfo[this.selectedRoleId]
      currentdRole[typeAttackKeyRole] && (currentdRole[typeAttackKeyRole] !== 'None' || currentdRole[typeAttackKeyRole] !== 'None.') ? hasAttackTooltip = true : null
      currentdRole[typeDefenseKeyRole] && (currentdRole[typeDefenseKeyRole] !== 'None' || this.beast[typeDefenseKeyRole] !== 'None.') ? hasDefenseTooltip = true : null
    }

    if (hasAttackTooltip && hasDefenseTooltip) {
      return `This monster has additional ${type} attack & defense abilities that will make them stronger than their raw stats might suggestion.`
    } else if (hasAttackTooltip) {
      return `This monster has additional ${type} attack abilities that will make them stronger than their raw stats might suggestion.`
    } else if (hasDefenseTooltip) {
      return `This monster has additional ${type} defense abilities that will make them stronger than their raw stats might suggestion.`
    }
  }

  downloadJson() {
    const { id, name: basicName, senses, meta, sp_atk, sp_def, tactics, size: basicSize, role: basicRole,
      secondaryrole: basicSecondaryRole, socialrole: basicSocialRole, socialsecondary: basicSocialSecondary,
      skillrole: basicSkillRole, notes, movement, rolenameorder, roleInfo, hash, combatStatArray,
      knockback: basicKnockback, notrauma: basicTrauma, noknockback: basicnoknockback, phyiscalAndStress, locationalvitality,
      spells, skills, challenges, obstacles, conflict, rollundertrauma: basicRollUnderTrauma, atk_skill,
      def_skill, atk_conf, def_conf, isincorporeal: basicisincorporeal, weaponbreakagevitality: basicweaponbreakagevitality,
      hasarchetypes, hasmonsterarchetypes, archetype, archetypemonster } = this.beast

    const selectedRoleInfo = roleInfo[this.selectedRoleId]

    const getCharacteristic = (characteristic, type) => {
      return {
        characteristic: characteristic.trait,
        rank: this.getSocialRank(type, characteristic.strength, characteristic.adjustment)
      }
    }

    const confrontation = {
      descriptions: conflict.descriptions.filter(characteristic => characteristic.socialroleid === this.selectedObstacleId || characteristic.allroles).map(characteristic => getCharacteristic(characteristic, 'Descriptions')),
      convictions: conflict.convictions.filter(characteristic => characteristic.socialroleid === this.selectedObstacleId || characteristic.allroles).map(characteristic => getCharacteristic(characteristic, 'Convictions')),
      devotions: conflict.devotions.filter(characteristic => characteristic.socialroleid === this.selectedObstacleId || characteristic.allroles).map(characteristic => getCharacteristic(characteristic, 'Devotions')),
      burdens: conflict.burdens.filter(characteristic => characteristic.socialroleid === this.selectedObstacleId || characteristic.allroles).map(characteristic => getCharacteristic(characteristic, 'Burdens')),
      flaws: conflict.flaws.filter(characteristic => characteristic.socialroleid === this.selectedObstacleId || characteristic.allroles).map(characteristic => characteristic.trait),
    }

    const name = `${this.modifier ? this.modifier + ' ' : ''}${this.selectedRoleId ? this.getNameWithRole() : this.formatNameWithCommas(basicName)}`
    const combatCounterHash = this.selectedRoleId ? selectedRoleInfo.hash : hash
    const size = this.selectedRoleId && selectedRoleInfo.size ? selectedRoleInfo.size : basicSize
    const role = this.selectedObstacleId ? selectedRoleInfo.role : basicRole
    const combatsecondary = this.selectedRoleId ? selectedRoleInfo.secondaryrole : basicSecondaryRole
    const socialrole = this.selectedRoleId ? selectedRoleInfo.socialrole : basicSocialRole
    const socialsecondary = this.selectedRoleId ? selectedRoleInfo.socialsecondary : basicSocialSecondary
    const skillrole = this.selectedRoleId ? selectedRoleInfo.skillrole : basicSkillRole
    const knockback = this.selectedRoleId ? selectedRoleInfo.knockback : basicKnockback
    const notrauma = this.selectedRoleId ? selectedRoleInfo.notrauma : basicTrauma
    const rollundertrauma = this.selectedRoleId ? selectedRoleInfo.rollundertrauma : basicRollUnderTrauma
    const noknockback = this.selectedRoleId ? selectedRoleInfo.noknockback : basicnoknockback
    const physical = this.selectedRoleId ? selectedRoleInfo.phyiscalAndStress.physical : phyiscalAndStress.physical
    const mental = this.selectedRoleId ? selectedRoleInfo.phyiscalAndStress.mental : phyiscalAndStress.mental
    const isincorporeal = this.selectedRoleId && selectedRoleInfo.isincorporeal ? selectedRoleInfo.isincorporeal : basicisincorporeal
    const weaponbreakagevitality = this.selectedRoleId && selectedRoleInfo.weaponbreakagevitality ? selectedRoleInfo.weaponbreakagevitality : basicweaponbreakagevitality

    const tokenBase = this.roleTokenExists && this.selectedRoleId ? this.beast.id + this.selectedRoleId : this.beast.id
    const tokenId = this.tokenExists ? tokenBase : this.beast.imagesource

    let archetypes = []
    if ((this.selectedRoleId && selectedRoleInfo.hasarchetypes) || hasarchetypes) {
      if (this.selectedRoleId) {
        archetypes.push(selectedRoleInfo.hasarchetypes)
      } else {
        archetypes.push(archetype.archetype)
      }
    }
    if ((this.selectedRoleId && selectedRoleInfo.hasmonsterarchetypes) || hasmonsterarchetypes) {
      if (this.selectedRoleId) {
        archetypes.push(archetypemonster[0].archetype)
        archetypes.push(archetypemonster[1].archetype)
      } else {
        archetypes.push(selectedRoleInfo.archetypemonster[0].archetype)
        archetypes.push(selectedRoleInfo.archetypemonster[1].archetype)
      }
    }

    let beastObj = {
      portrait: 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + tokenId + '-token',
      name, metanotes: meta, mental, personalnotes: notes,
      confrontation: {
        ...confrontation,
        role: socialrole,
        secondary: socialsecondary,
        attacknotes: atk_conf,
        defensenotes: def_conf,
        roleattacks: selectedRoleInfo ? selectedRoleInfo.attack_conf : null,
        roledefenses: selectedRoleInfo ? selectedRoleInfo.defense_conf : null,
        archetypes
      },
      combat: {
        attacknotes: sp_atk, defensenotes: sp_def, tactics, combatCounterHash,
        roleattacks: selectedRoleInfo ? selectedRoleInfo.attack : null,
        roledefenses: selectedRoleInfo ? selectedRoleInfo.defense : null,
        role: role,
        secondary: combatsecondary,
        attacks: combatStatArray.filter(combat => combat.roleid === this.selectedRoleId).map(combat => combat.combatSquare),
        physical: {
          ...physical, knockback, notrauma, noknockback, size, senses, rollundertrauma, isincorporeal, weaponbreakagevitality,
          locationalvitality: locationalvitality.filter(location => location.roleid === this.selectedRoleId || location.allroles),
          movement: movement.filter(move => move.roleid === this.selectedRoleId || move.allroles),

        },
      },
      spells: spells.filter(spell => spell.roleid === this.selectedRoleId || spell.allroles),
      skills: {
        challenges, obstacles, skillrole,
        skill: skills.filter(skill => skill.skillroleid === this.selectedRoleId || skill.allroles).map(skill => {
          return {
            skill: skill.skill,
            rank: this.getSkillRank(skill.strength, skill.adjustment)
          }
        }),
        attacknotes: atk_skill,
        defensenotes: def_skill,
        roleattacks: selectedRoleInfo ? selectedRoleInfo.attack_skill : null,
        roledefenses: selectedRoleInfo ? selectedRoleInfo.defense_skill : null,
      }
    }

    var sJson = JSON.stringify(beastObj);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', `${beastObj.name}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
