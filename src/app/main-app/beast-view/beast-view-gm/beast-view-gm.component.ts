import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeastService } from '../../../util/services/beast.service';
import variables from '../../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private dialog: MatDialog
  ) { }

  public beast = {name: null}
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
  }

  openExplaination () {
    this.dialog.open(HewyRatingComponent);
  }

}
