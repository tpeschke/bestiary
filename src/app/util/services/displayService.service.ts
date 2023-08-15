import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayServiceService {

  constructor() { }

  turnOnAllEquipment () {
    
  }

  returnSizeDefenseModifier (size, addsizemod) {
    if (!addsizemod) {
      return 0
    }
    switch (size) {
      case "Fine":
        return 12
      case "Diminutive":
        return 9
      case "Tiny":
        return 6
      case "Small":
        return 3
      case "Medium":
        return 0
      case "Large":
        return -3
      case "Huge":
        return -6
      case "Giant":
        return -9
      case "Enormous":
        return -12
      case "Colossal":
        return -15
      default:
        return 0
    }
  }

  returnSizeMeasureModifier = (size, addsizemod) => {
    if (!addsizemod) {
      return 0
    }
    switch (size) {
      case "Fine":
        return -4
      case "Diminutive":
        return -3
      case "Tiny":
        return -2
      case "Small":
        return -1
      case "Medium":
        return 0
      case "Large":
        return 1
      case "Huge":
        return 2
      case "Giant":
        return 3
      case "Enormous":
        return 4
      case "Colossal":
        return 5
      default:
        return 0
    }
  }

}
