import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-defense-display',
  templateUrl: './defense-display.component.html',
  styleUrls: ['../../../beast-view.component.css', './defense-display.component.css']
})
export class DefenseDisplayComponent implements OnInit {
  @Input() selectedRoleId: any;
  @Input() defenses: any;
  @Input() defenseInfo: any;
  @Input() points: any;
  @Input() setVitalityAndStress: Function;
  @Input() size: any;
  @Input() secondaryRole: any;
  @Input() removeCombatStatFromArray: Function;
  @Input() beast: any;
  @Input() captureHTML: Function;
  @Input() roleInfo: any;
  @Input() removeTable: Function;
  @Input() addNewTable: Function;
  @Input() beastInfo: any;
  @Input() addNewSecondaryItem: Function;
  @Input() setDefenseInfo: Function

  constructor() { }
  
  ngOnInit() {
  }



}
