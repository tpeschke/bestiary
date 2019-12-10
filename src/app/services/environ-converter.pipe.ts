import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'environConverter'
})
export class EnvironConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (+value) {
      case 1:
        return 'Dungeon/Ruins';
      case 2:
        return 'Wilderness';
      case 3:
        return 'Forest';
      case 4:
        return 'Castle';
      case 5:
        return 'Cave/Underground';
      case 6:
        return 'Mountain';
      case 7:
        return 'Plains';
      case 8:
        return 'Swamp';
      case 9:
        return 'Urban';
      case 10:
        return 'Ship';
      case 11:
        return 'Coastal';
      case 12:
        return 'Aquatic';
      case 13:
        return 'Other';
      case 14:
        return 'Desert';
      case 15:
        return 'Island';
      case 16:
        return 'Jungle';
      case 17:
        return 'Sewer';
      case 18:
        return 'House';
      default:
        return value
    }
  }

}
