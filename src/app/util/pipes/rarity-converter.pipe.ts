import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rarityConverter'
})
export class RarityConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (+value) {
      case 1:
        return 'Legendary';
      case 3:
        return 'Rare';
      case 5:
        return 'Uncommon';
      case 10:
        return 'Common';
      default:
        return 'None'
    }
    return null;
  }

}
