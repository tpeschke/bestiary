import { Component, OnInit, Input } from '@angular/core';
import tooltips from '../rudiment-tooltips.js'

@Component({
  selector: 'app-weird-shaping-display',
  templateUrl: './weird-shaping-display.component.html',
  styleUrls: ['../weird-shaping.component.css']
})
export class WeirdShapingDisplayComponent implements OnInit {
  @Input() casting = null;
  @Input() spells = null;

  constructor() { }

  public castingSelect = []
  public selectedCast = ''
  public isHowToDisplayed = false
  public tooltips = null

  ngOnInit() {
    this.tooltips = tooltips
    
    if (this.casting.commanding) {
      this.castingSelect.push('Adamic Commanding')
    }
    if (this.casting.augur) {
      this.castingSelect.push('Augur')
    }
    if (this.casting.bloodpact) {
      this.castingSelect.push('Blood Pact')
    }
    if (this.casting.manifesting) {
      this.castingSelect.push('Manifesting')
    }
    if (this.casting.vancian) {
      this.castingSelect.push('Vancian')
    }
    if (this.casting.wild) {
      this.castingSelect.push('Wild Magic')
    }
    this.selectedCast = this.castingSelect[0]
  }

  captureSelect(e) {
    this.selectedCast = e.value
  }

  displayHowTo() {
    this.isHowToDisplayed = !this.isHowToDisplayed
  }

}
