import { Component, OnInit, Input } from '@angular/core';
import lootTables from '../../loot-tables.js'

@Component({
  selector: 'app-equipment-display',
  templateUrl: './equipment-display.component.html',
  styleUrls: ['./equipment-display.component.css', '../../beast-view.component.css']
})
export class EquipmentDisplayComponent implements OnInit {
  @Input() items: any;
  @Input() lootLocation: any;
  @Input() updateItem: Function;
  @Input() removeItem: Function;
  @Input() captureAddItem: Function;

  public itemCategories = lootTables.itemCategories

  public defaultItem = {
    materialrarity: 'C',
    detailing: 'N',
    wear: '1d4',
    chance: 'b',
    number: 1,
  }

  constructor() { }

  ngOnInit() {
  }

  updateDefault(event, type) {
    if (event.value) {
      this.defaultItem[type] = event.value
    } else {
      this.defaultItem[type] = event.target.value
    }
  }

  addItem(categoryId) {
    this.captureAddItem({...this.defaultItem, itemcategory: categoryId}, this.lootLocation)
  }

}
