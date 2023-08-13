import { Component, OnInit, Input } from '@angular/core';
import roles from '../../roles.js'

@Component({
  selector: 'app-MentalPhyiscalDisplay',
  templateUrl: './MentalPhyiscalDisplay.component.html',
  styleUrls: ['../../beast-view.component.css', './MentalPhyiscalDisplay.component.css']
})
export class MentalPhyiscalDisplayComponent implements OnInit {
  @Input() statInfo: any;
  @Input() stats: any
  @Input() primaryRole: any;
  @Input() checkStat: Function
 
  constructor() { }

  public roleInfo = null;

  ngOnInit() {
  }

  ngOnChanges(changes) {
    this.setRoleInfo()
  }

  setRoleInfo = () => {
    if (this.primaryRole) {
      this.roleInfo = roles.combatRoles.primary[this.primaryRole].meleeCombatStats
    }
  }
}
