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
        return 'Unsure';
      case 3: 
        return 'Tired';
      case 4:
        return 'Shaken';
      case 5:
        return 'Breaking'
      case 7:
        return 'Never'
      default: value
    }
  }

}
