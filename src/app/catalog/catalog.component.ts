import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../util/services/beast.service'
import variables from '../../local.js'
import {Title} from "@angular/platform-browser";
import { QuickViewService } from '../util/services/quick-view.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private titleService: Title,
    private quickViewService: QuickViewService
  ) { }

  public beasts = []
  public favorites: any = []
  public imageBase = variables.imageBase;
  public message = "You Don't Have Any Favorite Monsters Yet"

  isDisplayContextMenu: boolean;
  rightClickMenuItems: any = [];
  rightClickMenuPositionX: number;
  rightClickMenuPositionY: number;

  ngOnInit() {
    this.titleService.setTitle("Bestiary")
    this.route.data.subscribe(data => {
      this.beasts = data['catalog']
    })
    this.beastService.getFavorites().subscribe((results:any) => {
      if (results.length > 0) {
        this.favorites = results
      } else if (results.message) {
        this.message = results.message
      }
    })
  }

  openNewTab(beastid) {
    window.open(window.location.href + 'beast/' + beastid + '/gm', '_blank');
  }

  displayContextMenu(event) {

    this.isDisplayContextMenu = true;

    this.rightClickMenuItems = [
      {
        menuText: 'Refactor',
        menuEvent: 'Handle refactor',
      },
      {
        menuText: 'Format',
        menuEvent: 'Handle format',
      },
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;

  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }

  handleMenuItemClick(event) {
    console.log(event)
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

}
