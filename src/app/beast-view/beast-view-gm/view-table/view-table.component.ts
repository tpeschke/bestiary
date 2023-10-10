import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css']
})
export class ViewTableComponent implements OnInit {
  @Input() table: any;
  
  constructor() { }

  ngOnInit() {
    this.updateCurrentTotal()
  }

  updateCurrentTotal = () => {
    let currentTotal = 0
    this.table.diceSize = null
    this.table.rows = this.table.rows.map(row => {
      const rowWithCurrentTotal = { ...row, currentTotal }
      currentTotal += +row.weight
      return rowWithCurrentTotal
    })
    this.table.diceSize = currentTotal
  }

}
