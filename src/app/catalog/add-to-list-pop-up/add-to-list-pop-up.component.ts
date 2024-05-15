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
    @Inject(MAT_DIALOG_DATA) public data: { beastid: string },
    public dialogRef: MatDialogRef<AddToListPopUpComponent>,
    private beastService: BeastService
  ) { }

  public lists = []

  ngOnInit() {
    this.beastService.getLists().subscribe(results => {
      this.lists = results
    })
  }

  addToList(listid) {
    this.beastService.addBeastToList({ beastid: this.data.beastid, listid }).subscribe(results => {
      if (results.color === 'green') {
        this.dialogRef.close();
      }
    })
  }

  addToNewList() {
    this.beastService.addBeastToList({ beastid: this.data.beastid }).subscribe(results => {
      if (results.color === 'green') {
        this.dialogRef.close();
      }
    })
  }
}
