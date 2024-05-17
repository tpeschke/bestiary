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
    console.log(this.beastService.loggedIn)
    this.route.data.subscribe(data => {
      if (!data.message) {
        this.lists = data['lists']
      }
    })

    const urlMatch = this.router.url.match(new RegExp("\/", "g")) || []
    if (urlMatch.length === 2) {
      const listid = this.router.url.split('/')[2]
      if (listid) {
        this.dialog.open(ListViewPopUpComponent, { width: '400px', data: { listid } });
      }
    } else if (urlMatch.length === 3 && this.router.url.split('/')[3] === 'directlyTo') {
      const listid = this.router.url.split('/')[2]
      this.beastService.getRandomMonsterFromList(listid).subscribe(beast => {
        this.router.navigate(['/beast', beast.beastid, 'gm']);
      })
    }
  }

  randomlyRoll(event, url) {
    event.stopImmediatePropagation()

    this.beastService.getRandomMonsterFromList(url).subscribe(beast => {
      this.router.navigate(['/beast', beast.beastid, 'gm']);
    })
  }

  goToEntry(beastid) {
    this.router.navigate(['/beast', beastid, 'gm']);
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
        this.beastService.updateListName({ name: value, listid: listid }).subscribe()
      }
    })
  }

  captureRarity(event, entryid) {
    this.beastService.updateBeastRarity({ rarity: event.target.value, entryid }).subscribe()
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

  getShortCutURL(urlstubb, isDirectlyTo) {
    let textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    let url = `${window.location.origin}/lists/${urlstubb}${isDirectlyTo ? '/directlyTo' : ''}`
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
