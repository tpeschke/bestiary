import { Component, OnInit, Input } from '@angular/core';

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
    console.log(this.combatSquare)
    this.isMelee = this.combatSquare.weaponType === 'm'
  }

}
