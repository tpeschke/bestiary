import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moraleConverter'
})
export class MoraleConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(+value) {
      case 1:
        return 'Fresh';
      case 2: 
        return 'Tired';
      case 3:
        return 'Hurt';
      case 4: 
        return 'Bloodied';
      case 5:
        return 'Wounded';
      case 6:
        return 'Bleeding Out'
      case 7:
        return 'Never'
      default: value
    }
  }

}
