import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  @Input() allSpells: any

  constructor() { }

  public spellsController: FormControl;
  public spellsFiltered: Observable<any[]>;
  
  public fullInfo: any

  ngOnInit() {
    this.spellsController = new FormControl(this.reagent.spell)
    this.spellsFiltered = this.spellsController.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        this.updateFullInfo(value, this.allSpells)
        return this._filter(value || '', this.allSpells, 'spell')
      }),
    );
  }

  updateFullInfo(value, allSpells) {
    if (value && allSpells) {
      this.fullInfo = null
      allSpells.forEach(spell => spell.spell === value ? this.fullInfo = spell : null)
    }
  }

  private _filter(value: any, filterArray: any, type: string): string[] {
    let filterValue: string
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value[type].toLowerCase();
    }
    return filterArray.filter(option => {
      return option[type].toLowerCase().includes(filterValue)
    });
  }

  captureSpellInput(event) {
    this.captureInput({target: {value: event.option.value}}, 'reagents', this.i, 'spell')
  }

}
