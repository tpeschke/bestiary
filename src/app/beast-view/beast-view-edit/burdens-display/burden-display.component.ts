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

  ngOnInit() { }

  ngOnChanges(changes) {
    if (!changes.allBurdenss.previousValue && changes.allBurdenss.currentValue) {
      this.updateFullInfo(this.burden.trait, changes.allBurdenss.currentValue)
    }
    this.bootUpAutoComplete()
  }

  bootUpAutoComplete() {
    this.burdensController = new FormControl(this.burden.trait)
    this.burdensFiltered = this.burdensController.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        this.updateFullInfo(value, this.allBurdens)
        return this._filterGroup(value || '', this.allBurdens, 'burdens')
      }),
    );
  }

  updateFullInfo(value, allBurdenss) {
    if (value && allBurdenss) {
      this.fullInfo = null
      allBurdenss.forEach(category => {
        category.burdenss.forEach(fullBurdens => fullBurdens.burdens === value ? this.fullInfo = fullBurdens : null)
      })

      if (this.fullInfo && this.burden.severity) {
        this.setRankBasedOnSeverity(+this.burden.severity)
      }
    }
  }

  captureSeverity(event, category, index, type, subtype) {
    if (this.fullInfo) {
      this.setRankBasedOnSeverity(event.target.value)
    }
    this.captureInput(event, category, index, type, subtype)
  }

  setRankBasedOnSeverity(severity) {
    const { base, per } = this.fullInfo.rank
    const fakeEvent = {
      target: { value: Math.ceil(base + (per * severity)) }
    }
    this.captureInput(fakeEvent, 'conflict', this.i, 'burdenss', 'value')
  }

  checkRandomBurdens (index, checked) {
    this.checkRandomizeBurden(index, checked)
    if (!checked) {
      this.burdensController.setValue('')
    }
  }

}
