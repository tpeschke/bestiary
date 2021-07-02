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

  ngOnInit() {}

  toggleQuickViewList () {
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

   trackedInCombatCounter (event) {
    this.isTrackedInCombatCounter = event.checked
   }

   goToEntry(beastId) {
    this.router.navigate([`/beast/${beastId}/gm`])
    this.quickViewListIsOpen = false;
   }

}
