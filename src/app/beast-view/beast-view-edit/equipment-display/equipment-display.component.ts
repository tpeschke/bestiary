import { Component, OnInit, Input } from '@angular/core';

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

  public itemCategories = [
    {
      "label": "Academic Tools",
      "id": 29
    },
    {
      "label": "Accessories",
      "id": 6
    },
    {
      "label": "Adventuring Gear",
      "id": 37
    },
    {
      "label": "Alchemical Substances",
      "id": 30
    },
    {
      "label": "Armor, Heavy",
      "id": 4
    },
    {
      "label": "Armor, Light",
      "id": 2
    },
    {
      "label": "Armor, Medium",
      "id": 3
    },
    {
      "label": "Beverages",
      "id": 14
    },
    {
      "label": "Clothing, Body",
      "id": 34
    },
    {
      "label": "Clothing, Footwear",
      "id": 35
    },
    {
      "label": "Clothing, Headgear",
      "id": 23
    },
    {
      "label": "Entertainment",
      "id": 7
    },
    {
      "label": "Fabrics & Ropes",
      "id": 25
    },
    {
      "label": "Food, Bread",
      "id": 9
    },
    {
      "label": "Food, Fruit & Vegetables",
      "id": 36
    },
    {
      "label": "Food, Nuts",
      "id": 10
    },
    {
      "label": "Food, Prepped",
      "id": 16
    },
    {
      "label": "Food, Protein",
      "id": 12
    },
    {
      "label": "Food, Spices & Seasonings",
      "id": 21
    },
    {
      "label": "Household Items",
      "id": 15
    },
    {
      "label": "Illumination",
      "id": 22
    },
    {
      "label": "Jewelry",
      "id": 24
    },
    {
      "label": "Medical Tools",
      "id": 33
    },
    {
      "label": "Musical Instruments",
      "id": 5
    },
    {
      "label": "Personal Containers",
      "id": 1
    },
    {
      "label": "Raw Goods",
      "id": 38
    },
    {
      "label": "Religious Items",
      "id": 26
    },
    {
      "label": "Shields",
      "id": 11
    },
    {
      "label": "Trade Tools",
      "id": 31
    },
    {
      "label": "Weapons, Axes",
      "id": 32
    },
    {
      "label": "Weapons, Firearms",
      "id": 13
    },
    {
      "label": "Weapons, Mechanical Ranged",
      "id": 18
    },
    {
      "label": "Weapons, Polearms",
      "id": 27
    },
    {
      "label": "Weapons, Sidearms",
      "id": 8
    },
    {
      "label": "Weapons, Swords",
      "id": 19
    },
    {
      "label": "Weapons, Thrown",
      "id": 17
    },
    {
      "label": "Weapons, Trauma",
      "id": 20
    },
    {
      "label": "Works of Art",
      "id": 28
    }
  ]

  public defaultItem = {
    materialrarity: 'C',
    detailing: 'N',
    wear: '1d4',
    chance: 10,
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
