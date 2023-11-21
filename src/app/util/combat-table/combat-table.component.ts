import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-combat-table',
  templateUrl: './combat-table.component.html',
  styleUrls: ['./combat-table.component.css']
})
export class CombatTableComponent implements OnInit {
  @Input() combatSquare: any

  constructor() { }

  public isMelee = true
  ngOnInit() {
  }

  ngOnChanges(changes) {
    this.isMelee = changes.combatSquare.currentValue.weaponType === 'm'
  }

}
