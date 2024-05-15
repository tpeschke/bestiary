import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeastService } from 'src/app/util/services/beast.service';

@Component({
  selector: 'app-add-to-list-pop-up',
  templateUrl: './add-to-list-pop-up.component.html',
  styleUrls: ['./add-to-list-pop-up.component.css']
})
export class AddToListPopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { beastid: string, beastidarray: [], rarity: string },
    public dialogRef: MatDialogRef<AddToListPopUpComponent>,
    private beastService: BeastService
  ) { }

  public lists = []
  public newRarity = null
  public isLoading = true;

  ngOnInit() {
    this.beastService.getLists().subscribe(results => {
      this.lists = results
      this.isLoading = false
    })
  }

  stopProp(event) {
    event.stopPropagation()
  }

  captureRarity = (event) => {
    this.newRarity = event.value
  }

  addToList(listid) {
    this.isLoading = true
    if (this.data.beastid) {
      this.beastService.addBeastToList({ beastid: this.data.beastid, listid, rarity: this.newRarity }).subscribe(results => {
        if (results.color === 'green') {
          this.dialogRef.close();
        } else {
          this.isLoading = false
        }
      })
    } else if (this.data.beastidarray) {
      this.beastService.addBeastToList({ beastidarray: this.data.beastidarray, listid, rarity: this.newRarity }).subscribe(results => {
        if (results.color === 'green') {
          this.dialogRef.close();
        } else {
          this.isLoading = false
        }
      })
    }
  }

  addToNewList() {
    this.isLoading = true
    if (this.data.beastid) {
      this.beastService.addBeastToList({ beastid: this.data.beastid, rarity: this.newRarity }).subscribe(results => {
        if (results.color === 'green') {
          this.dialogRef.close();
        } else {
          this.isLoading = false
        }
      })
    } else if (this.data.beastidarray) {
      this.beastService.addBeastToList({ beastidarray: this.data.beastidarray, rarity: this.newRarity }).subscribe(results => {
        if (results.color === 'green') {
          this.dialogRef.close();
        } else {
          this.isLoading = false
        }
      })
    }
  }
}
