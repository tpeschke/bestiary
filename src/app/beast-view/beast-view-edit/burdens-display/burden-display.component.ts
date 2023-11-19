import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-burden-display',
  templateUrl: './burden-display.component.html',
  styleUrls: ['./burden-display.component.css', '../../beast-view.component.css']
})
export class BurdenDisplayComponent implements OnInit {
  @Input() burden: any;
  @Input() allBurdens: any;
  @Input() captureInput: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() i: any;
  @Input() checkAllRoles: Function;
  @Input() _filterGroup: Function;
  @Input() checkRandomizeBurden: Function;
  @Input() setRankSeverityRank: Function;

  constructor() { }

  public burdensController: FormControl;
  public burdensFiltered: Observable<any[]>;

  public fullInfo: any

  ngOnInit() {  }

  ngOnChanges(changes) {
    if (!changes.allBurdens.previousValue && changes.allBurdens.currentValue) {
      this.updateFullInfo(this.burden.trait, changes.allBurdens.currentValue)
    }
    this.bootUpAutoComplete()
  }

  bootUpAutoComplete() {
    this.burdensController = new FormControl(this.burden.trait)
    this.burdensFiltered = this.burdensController.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        this.updateFullInfo(value, this.allBurdens)
        return this._filterGroup(value || '', this.allBurdens, 'trait')
      }),
    );
  }

  updateFullInfo(value, allBurdens) {
    if (value && allBurdens) {
      this.fullInfo = null
      allBurdens.forEach(category => {
        category.burdens.forEach(burden => burden.trait === value ? this.fullInfo = burden : null)
      })
    }
  }

  captureSeverity(event, category, index, type, subtype) {
    this.captureInput(event, category, index, type, subtype)
  }

  checkRandomBurden (index, checked) {
    this.checkRandomizeBurden(index, checked)
    if (!checked) {
      this.burdensController.setValue('')
    }
  }

}
