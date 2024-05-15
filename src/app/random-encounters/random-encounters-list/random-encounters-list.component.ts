import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { BeastService } from '../../util/services/beast.service';

@Component({
  selector: 'app-random-encounters-list',
  templateUrl: './random-encounters-list.component.html',
  styleUrls: ['./random-encounters-list.component.css', '../../catalogs/catalog/catalog.component.css']
})
export class RandomEncountersListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
  ) { }

  public lists = []
  public checkForDelete = {}

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
    this.lists.forEach(list => {
      if (list.id === listid && list.name !== value) {
        this.beastService.updateListName({name: value, id: listid}).subscribe()
      }
    })
  }

  captureRarity(event, entryid) {
    this.beastService.updateBeastRarity({rarity: event.target.value, entryid}).subscribe()
  }

  toggleCheckDelete = (id) => {
    this.checkForDelete[id] = !this.checkForDelete[id]
  }

  removeThisEntry = (entryid, listid) => {
    this.beastService.deleteBeastFromList(entryid).subscribe(_ => {
      this.lists = this.lists.map(list => {
        if (list.id === listid) {
          list.beasts = list.beasts.filter(beast => beast.id !== entryid)
        }
        return list
      })
    })
  }

}
