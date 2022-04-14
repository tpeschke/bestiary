import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuickViewService } from 'src/app/util/services/quick-view.service';

@Component({
  selector: 'app-quick-view-drawer',
  templateUrl: './quick-view-drawer.component.html',
  styleUrls: ['./quick-view-drawer.component.css']
})
export class QuickViewDrawerComponent implements OnInit {

  constructor(
    private router: Router,
    private quickViewService: QuickViewService
  ) { }

  private quickViewListIsOpen = false
  private isTrackedInCombatCounter = false

  ngOnInit() { }

  toggleQuickViewList() {
    this.quickViewListIsOpen = !this.quickViewListIsOpen
  }

  isNumber(val): boolean {
    return !isNaN(+val);
  }

  addAnotherVitality(beastIndex) {
    this.quickViewService.addAnotherVitalityToBeast(beastIndex)
  }

  removeVitality(beastIndex, vitalityIndex) {
    this.quickViewService.removeVitalityFromBeast(beastIndex, vitalityIndex)
  }

  checkCheckbox(event, index, location, beastIndex, vitalityIndex) {
    this.quickViewService.checkCheckbox(event, index, location, beastIndex, vitalityIndex)
  }

  trackedInCombatCounter(event) {
    this.isTrackedInCombatCounter = event.checked
  }

  goToEntry(beastId) {
    this.router.navigate([`/beast/${beastId}/gm`])
    this.quickViewListIsOpen = false;
  }

  convertPanic(stress, panic) {
    let percentage = .00;
    switch (panic) {
      case 1:
        return 'Always';
      case 2:
        return 1
      case 3:
        percentage = .25
        break;
      case 4:
        percentage = .5
        break;
      case 5:
        percentage = .75
        break;
      case 7:
        return 'Never'
      default: panic
    }

    return (stress * percentage).toFixed(0)
  }

  convertFatigue(vitality, fatigue) {
    let percentage = .00;
    switch (fatigue) {
      case 'H':
        return 1
      case 'B':
        percentage = .25
        break;
      case 'W':
        percentage = .5
        break;
      case 'C':
        percentage = .75
        break;
      default: 
        return fatigue
    }

    return (vitality * percentage).toFixed(0)
  }

}
