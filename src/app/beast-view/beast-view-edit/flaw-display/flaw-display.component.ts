import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-flaw-display',
  templateUrl: './flaw-display.component.html',
  styleUrls: ['./flaw-display.component.css', '../../beast-view.component.css']
})
export class FlawDisplayComponent implements OnInit {
  @Input() flaw: any;
  @Input() allFlaws: any;
  @Input() captureInput: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() i: any;
  @Input() checkAllRoles: Function;
  @Input() _filterGroup: Function;
  @Input() checkRandomizeFlaw: Function;
  @Input() setRankSeverityRank: Function;

  constructor() { }

  public flawController: FormControl;
  public flawFiltered: Observable<any[]>;

  public fullInfo: any

  ngOnInit() { }

  ngOnChanges(changes) {
    if (!changes.allFlaws.previousValue && changes.allFlaws.currentValue) {
      this.updateFullInfo(this.flaw.trait, changes.allFlaws.currentValue)
    }
    this.bootUpAutoComplete()
  }

  bootUpAutoComplete() {
    this.flawController = new FormControl(this.flaw.trait)
    this.flawFiltered = this.flawController.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        this.updateFullInfo(value, this.allFlaws)
        return this._filterGroup(value || '', this.allFlaws, 'flaw')
      }),
    );
  }

  updateFullInfo(value, allFlaws) {
    if (value && allFlaws) {
      this.fullInfo = null
      allFlaws.forEach(category => {
        category.flaws.forEach(fullFlaw => fullFlaw.flaw === value ? this.fullInfo = fullFlaw : null)
      })

      if (this.fullInfo && this.flaw.severity) {
        this.setRankBasedOnSeverity(+this.flaw.severity)
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
    this.captureInput(fakeEvent, 'conflict', this.i, 'flaws', 'value')
  }

  checkRandomFlaw (index, checked) {
    this.checkRandomizeFlaw(index, checked)
    if (!checked) {
      this.flawController.setValue('')
    }
  }

}
