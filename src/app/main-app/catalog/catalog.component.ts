import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../../util/services/beast.service'
import variables from '../../../local.js'
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService
  ) { }

  public beasts = []
  public imageBase = variables.imageBase;

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beasts = data['catalog']
    })
  }

}
