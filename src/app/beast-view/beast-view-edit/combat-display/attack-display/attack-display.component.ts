import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attack-display',
  templateUrl: './attack-display.component.html',
  styleUrls: ['./attack-display.component.css']
})
export class AttackDisplayComponent implements OnInit {
  @Input() selectedRoleId: any;
  @Input() attacks: any;
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
  @Input() setAttackInfo: Function;

  constructor() { }

  ngOnInit() {
  }

}
