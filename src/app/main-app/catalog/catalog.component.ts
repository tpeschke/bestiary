import { Component, OnInit } from '@angular/core';
import { BeastService } from '../beast.service'

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(
    private beastService: BeastService
  ) { }

  public beasts = []

  ngOnInit() {
    this.beastService.getCatalog().subscribe(allBeasts => {
      this.beasts = allBeasts
    })
  }

}
