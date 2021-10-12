import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-weird-shaping-edit',
  templateUrl: './weird-shaping-edit.component.html',
  styleUrls: ['../weird-shaping.component.css']
})
export class WeirdShapingEditComponent implements OnInit {
  @Input() casting = null;
  @Input() spells = null;
  @Input() checkWeirdshapeType: Function;
  @Input() captureSpellDie: Function;
  @Input() captureSpellSelect: Function;
  @Input() captureSpellInput: Function;
  @Input() captureSpellHTML: Function;
  @Input() addNewSpell: Function;
  @Input() deleteSpell: Function;

  constructor() { }

  castingSelect = []

  ngOnInit() {
  }

}
