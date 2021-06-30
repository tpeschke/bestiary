import { Component, OnInit } from '@angular/core';
import { QuickViewService } from 'src/app/util/services/quick-view.service';

@Component({
  selector: 'app-quick-view-drawer',
  templateUrl: './quick-view-drawer.component.html',
  styleUrls: ['./quick-view-drawer.component.css']
})
export class QuickViewDrawerComponent implements OnInit {

  constructor(
    private quickViewService: QuickViewService
  ) { }

  private quickViewListIsOpen = true

  ngOnInit() {}

  toggleQuickViewList () {
    this.quickViewListIsOpen = !this.quickViewListIsOpen
  }

}
