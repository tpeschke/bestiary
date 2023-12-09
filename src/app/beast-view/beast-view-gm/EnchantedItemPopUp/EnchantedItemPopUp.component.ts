import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-EnchantedItemPopUp',
  templateUrl: './EnchantedItemPopUp.component.html',
  styleUrls: ['./EnchantedItemPopUp.component.css']
})
export class EnchantedItemPopUpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {loot: any},
    public dialogRef: MatDialogRef<EnchantedItemPopUpComponent>,
  ) { }

  public loot = this.data.loot

  ngOnInit() {
    console.log(this.loot)
  }

}
