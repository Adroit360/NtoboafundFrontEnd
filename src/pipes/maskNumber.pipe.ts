import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskNumber'
})
export class MaskNumberPipe implements PipeTransform {

  transform(value: number|string, args?: any): any {
    if(!value)return '';
    if(!isNaN(Number(value))){
      let numberString = value.toString();
      let firstThree = numberString.substring(0,3);
      let lastTwo = numberString.substring(numberString.length-3,numberString.length-1);
      let remainingStringLength:number = numberString.length - 5;

      return firstThree + "*".repeat(remainingStringLength)+lastTwo;
    }


    return value;
  }

}
