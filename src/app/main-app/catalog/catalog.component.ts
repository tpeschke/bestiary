import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../../services/beast.service'
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

  ngOnInit() {
    this.beasts = this.route.snapshot.data['catalog'];
  }

}
