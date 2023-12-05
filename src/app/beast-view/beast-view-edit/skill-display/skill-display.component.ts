import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import roles from '../../roles.js'

@Component({
  selector: 'app-skill-display',
  templateUrl: './skill-display.component.html',
  styleUrls: ['./skill-display.component.css', '../../beast-view.component.css']
})
export class SkillDisplayComponent implements OnInit {
  @Input() skillInfo: any;
  @Input() captureInput: Function;
  @Input() removeNewSecondaryItem: Function;
  @Input() i: any;
  @Input() selectedSkillRole: any;

  constructor() { }

  public skillList = roles.skillList

  allSkillControl: any;
  skillGroupOptions: Observable<any[]>;

  ngOnInit() {}

  ngOnChanges(changes) {
    this.bootUpAutoComplete()
  }

  bootUpAutoComplete (){
    this.allSkillControl = new FormControl(this.skillInfo.skill);
    this.skillGroupOptions = this.allSkillControl.valueChanges
    .pipe(
      startWith(''),
      map((value: string) => this._filterGroup(value))
    );
  }

  _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
    return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  };

  _filterGroup(value: string): any[] {
    if (!this.selectedSkillRole || !this.selectedSkillRole.skillList) {
      if (value) {
        return this.skillList
          .map(group => ({ label: group.label, skillList: this._filter(group.skillList, value) }))
          .filter(group => group.skillList.length > 0);
      }
      return this.skillList;
    } else {
      if (value) {
        return this.selectedSkillRole.skillList
          .map(group => ({ label: group.label, skillList: this._filter(group.skillList, value) }))
          .filter(group => group.skillList.length > 0);
      }
      return this.selectedSkillRole.skillList;
    }
  }

  captureSelected(event) {
    this.captureInput({ target: { value: event.option.value } }, 'skills', this.i, 'skill')
  }

}
