import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BeastService } from 'src/app/util/services/beast.service';

@Component({
  selector: 'app-list-view-pop-up',
  templateUrl: './list-view-pop-up.component.html',
  styleUrls: ['./list-view-pop-up.component.css']
})
export class ListViewPopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { listid: string },
    public dialogRef: MatDialogRef<ListViewPopUpComponent>,
    private beastService: BeastService
  ) { }

  public isLoading = true;
  public list = {}

  ngOnInit() {
    this.beastService.getListByHash(this.data.listid).subscribe(list => {
      this.list = list
      this.isLoading = false;
    })
  }

}
