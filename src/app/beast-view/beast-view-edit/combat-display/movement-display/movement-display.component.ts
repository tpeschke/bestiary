import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movement-display',
  templateUrl: './movement-display.component.html',
  styleUrls: ['../../../beast-view.component.css', './movement-display.component.css']
})
export class MovementDisplayComponent implements OnInit {
  @Input() movement: any;
  @Input() selectedRole: any;
  @Input() checkMovementStat: Function;
  @Input() getAdjustment: Function;
  @Input() selectedRoleId: any;
  @Input() captureInput: Function;
  @Input() checkAllRoles: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() addNewSecondaryItem: Function;

  constructor() { }

  public movementStats = [
    {
      label: 'Crawl',
      stat: 'strollstrength',
      speed: 'strollspeed',
    },
    {
      label: 'Walk',
      stat: 'walkstrength',
      speed: 'walkspeed',
    },
    {
      label: 'Jog',
      stat: 'jogstrength',
      speed: 'jogspeed',
    },
    {
      label: 'Run',
      stat: 'runstrength',
      speed: 'runspeed',
    },
    {
      label: 'Sprint',
      stat: 'sprintstrength',
      speed: 'sprintspeed',
    },
  ]

  ngOnInit() {
  }

}
