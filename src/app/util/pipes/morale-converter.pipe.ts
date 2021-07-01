import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moraleConverter'
})
export class MoraleConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(+value) {
      case 1:
        return 'Always';
      case 2:
        return 'Hurt';
      case 3: 
        return 'Bloodied';
      case 4:
        return 'Wounded';
      case 5:
        return 'Critical'
      case 7:
        return 'Never'
      default: value
    }
  }

}
