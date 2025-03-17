import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vitality-fatigue-display',
  templateUrl: './vitality-fatigue-display.component.html',
  styleUrls: ['../../../beast-view.component.css', './vitality-fatigue-display.component.css']
})
export class VitalityFatigueDisplayComponent implements OnInit {
  @Input() beastInfo: any;
  @Input() notrauma: any;
  @Input() physical: any;
  @Input() checkStat: Function;
  @Input() checkCheckBox: Function;
  @Input() captureBasicInput: Function;
  @Input() checkTrauma: Function;
  @Input() captureSliderInput: Function;
  @Input() captureInput: Function;
  @Input() checkAllRoles: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() addNewSecondaryItem: Function;
  @Input() sizeDictionary: any;

  constructor() { }

  public physicalStats = [
    {
      label: 'Vitality',
      stat: 'largeweapons',
      tooltip: 'Defense Against Large Weapons'
    },
    {
      label: 'Fatigue',
      stat: 'fatigue',
    }, 
    {
      label: 'Initiative',
      stat: 'initiative',
    }
  ]

  ngOnInit() {
  }

}
