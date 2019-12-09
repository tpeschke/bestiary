import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeastService } from '../../../services/beast.service';

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['./beast-view-edit.component.css']
})
export class BeastViewEditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService
  ) { }

  public beast = {}
  public loggedIn = this.beastService.loggedIn || false;

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
  }

}
