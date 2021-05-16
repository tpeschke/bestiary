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
        return 'Undead, Incorporeal';
      case 4:
        return 'Elemental';
      case 5:
        return 'Natural Creature';
      case 6:
        return 'Weird Creature';
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
      case 12:
        return 'Aos Sidhe';
      case 13:
        return 'Spirit';
      case 14:
        return 'Eldritch';
      default:
        return value;
    }
  }

}
