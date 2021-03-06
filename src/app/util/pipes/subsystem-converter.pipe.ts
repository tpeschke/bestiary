import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subsystemConverter'
})
export class SubsystemConverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(+value) {
      case 1:
        return 'Combat';
      case 2:
        return 'Confrontation';
      case 3:
        return 'Skill';
      default:
        return 'None'
    }
    return null;
  }

}
