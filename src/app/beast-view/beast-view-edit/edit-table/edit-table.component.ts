import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.css']
})
export class EditTableComponent implements OnInit {
  @Input() table: any;
  @Input() index: any;
  @Input() removeTable: Function;

  constructor() { }

  public weight;
  public value;

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

  removeThisTable = () => {
    this.removeTable(this.index)
  }

  captureNewRowInfo = (event, type) => {
    this[type] = event.target.value
  }

  addRow = () => {
    const { weight, value } = this
    if (weight && value) {
      this.table.rows.push({ weight: +weight, value })
      this.updateCurrentTotal()
      this.weight = null
      this.value = null
    }

    let inputs = document.getElementById('edit-table' + this.index).getElementsByTagName('input');
    for (let i = 0; i < inputs.length; ++i) {
      if (inputs[i].className.includes('edit-table-clearable')) {
        inputs[i].value = null
      }
    }
  }

  updateRowInfo = (event, type, index) => {
    if (index || index === 0) {
      this.table.rows[index][type] = event.target.value
      if (type === 'weight') {
        this.updateCurrentTotal()
      }
    } else {
      this.table[type] = event.target.value
    }
  }

  removeRow = (index) => {
    this.table.rows.splice(index, 1)
    this.updateCurrentTotal()
  }
}
