import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pleroma-display',
  templateUrl: './pleroma-display.component.html',
  styleUrls: ['./pleroma-display.component.css', '../beast-view-edit.component.css', '../../beast-view.component.css']
})
export class PleromaDisplayComponent implements OnInit {
  @Input() reagent: any;
  @Input() captureInput: Function;
  @Input() captureEncounterSecondary: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() i: any

  constructor() { }

  ngOnInit() {
  }

}
