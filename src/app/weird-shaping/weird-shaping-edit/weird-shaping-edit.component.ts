import { Component, OnInit, Input } from '@angular/core';
import tooltips from '../rudiment-tooltips.js'

@Component({
  selector: 'app-weird-shaping-edit',
  templateUrl: './weird-shaping-edit.component.html',
  styleUrls: ['../weird-shaping.component.css']
})
export class WeirdShapingEditComponent implements OnInit {
  @Input() casting = null;
  @Input() spells = null;
  @Input() checkWeirdshapeType: Function;
  @Input() changeDefaultType: Function;
  @Input() captureSpellDie: Function;
  @Input() captureSpellSelect: Function;
  @Input() captureSpellInput: Function;
  @Input() captureSpellHTML: Function;
  @Input() addNewSpell: Function;
  @Input() deleteSpell: Function;
  @Input() addToAllRoles: Function;
  @Input() selectedRoleId: string;

  constructor() { }

  castingSelect = []
  tooltips = null
  checkForDelete = false
  indexToDelete = null

  ngOnInit() {
    this.tooltips = tooltips
  }

  goAheadAndDelete = (index) => {
    this.checkForDelete = false
    this.indexToDelete = null
    this.deleteSpell(index)
  }

  toggleCheckDelete = (index) => {
    this.checkForDelete = !this.checkForDelete
    this.indexToDelete = index
  }

}
