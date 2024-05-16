import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router'
import { BeastService } from '../../util/services/beast.service';
import { ListViewPopUpComponent } from '../list-view-pop-up/list-view-pop-up.component';

@Component({
  selector: 'app-random-encounters-list',
  templateUrl: './random-encounters-list.component.html',
  styleUrls: ['./random-encounters-list.component.css', '../../catalogs/catalog/catalog.component.css']
})
export class RandomEncountersListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  public lists = []
  public checkForEntryDelete = {}
  public checkForListDelete = {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.lists = data['lists']
    })

    if ((this.router.url.match(new RegExp("\/", "g")) || []).length === 2) {
      const listid = this.router.url.split('/')[2]
      if (listid) {
        this.dialog.open(ListViewPopUpComponent, { width: '400px', data: { listid }});
      }
    }
  }

  addNewTest() {
    this.beastService.addList().subscribe(result => {
      if (result[0].id) {
        this.beastService.getListsWithBeasts().subscribe(lists => this.lists = lists)
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

  toggleCheckEntryDelete = (id) => {
    this.checkForEntryDelete[id] = !this.checkForEntryDelete[id]
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

  toggleCheckListDelete = (id) => {
    this.checkForListDelete[id] = !this.checkForListDelete[id]
  }

  removeThisList = (listid) => {
    this.beastService.deleteList(listid).subscribe(_ => {
      this.lists = this.lists.filter(list => list.id !== listid)
    })
  }

  getShortCutURL(urlstubb) {
    let textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    let url = `${window.location.origin}/lists/${urlstubb}`
    textArea.value = url;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.beastService.handleMessage({ color: 'green', message: `${url} successfully copied` })
    } catch (err) {
      this.beastService.handleMessage({ color: 'red', message: `Unable to copy ${url}` })
    }

    document.body.removeChild(textArea);
  }

}
