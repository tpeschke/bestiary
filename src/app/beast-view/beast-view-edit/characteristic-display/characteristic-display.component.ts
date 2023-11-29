import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service.js';
import roles from '../../roles.js'

@Component({
  selector: 'app-characteristic-display',
  templateUrl: './characteristic-display.component.html',
  styleUrls: ['../../beast-view.component.css', './characteristic-display.component.css']
})

export class CharacteristicDisplayComponent implements OnInit {
  @Input() characteristicType: any;
  @Input() characteristicInfo: any;
  @Input() primaryRole: any;
  @Input() checkCharacteristic: Function;
  @Input() captureInput: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() selectedRoleId: any;
  @Input() ranksToDistribute: any;

  constructor(
    private beastService: BeastService,
  ) { }

  public roleInfo = {
    Conviction: null,
    Description: null,
    Devotion: null,
  };

  ngOnInit() {
  }

  typeDictionary = {
    Conviction: 'convictions',
    Description: 'descriptions',
    Devotion: 'devotions',
  }

  ngOnChanges(changes) {
    console.log(this.ranksToDistribute)
    if (this.primaryRole) {
      this.roleInfo = roles.socialRoles.primary[this.primaryRole].characteristicStrengths
    }
  }

  checkcharacteristicInner(strength, index, event) {
    this.checkCharacteristic(this.typeDictionary[this.characteristicType], index, strength, event)
  }

  checkRandomize = (index, checked) => {
    if (checked) {
      this.characteristicInfo[index].trait = 'Any'
    } else {
      this.characteristicInfo[index].trait = ''
    }
  }

  checkAll = (index, checked) => {
    this.characteristicInfo[index].allroles = checked
  }

  captureName = (event, index) => {
    this.captureInput(event, 'conflict', index, this.typeDictionary[this.characteristicType], 'trait')
  }

  removeCharacteristic = (index) => {
    this.removeNewSecondaryItem('conflict', index, this.typeDictionary[this.characteristicType])
  }
}
