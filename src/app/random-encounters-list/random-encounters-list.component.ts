import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../util/services/beast.service';

@Component({
  selector: 'app-random-encounters-list',
  templateUrl: './random-encounters-list.component.html',
  styleUrls: ['./random-encounters-list.component.css', '../catalog/catalog.component.css']
})
export class RandomEncountersListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
  ) { }

  public lists = []

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.lists = data['lists']
    })
  }

  addNewTest() {
    this.beastService.addList().subscribe(result => {
      if (result[0].id) {
        this.beastService.getLists().subscribe(lists => this.lists = lists)
      }
    })
  }

  updateName(listid, event) {
    const value = event.target.value
    console.log(value)
    this.lists.forEach(list => {
      if (list.id === listid && list.name !== value) {
        this.beastService.updateListName({name: value, id: listid}).subscribe(result => {
          console.log(result)
        })
      }
    })
  }

}
