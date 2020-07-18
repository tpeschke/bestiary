import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeConverter'
})
export class TypeConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (+value) {
      case 1:
        return 'Demon';
      case 2:
        return 'Undead, Corporeal';
      case 3:
        return 'Undead, Spirit';
      case 4:
        return 'Elemental';
      case 5:
        return 'Natural Creature';
      case 6:
        return 'Magical Creature';
      case 7:
        return 'Humanoid';
      case 8:
        return 'Intelligent Evil';
      case 9:
        return 'Goblinoid';
      case 10:
        return 'Swarm';
      case 11:
        return 'Flora';
      default:
        return value;
    }
  }

}
