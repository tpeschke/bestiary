import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  calculateAverageOfDice(diceString) {
    let totalValue = 0
    diceString
        .replace(/!| /g, '')
        .split('+')
        .forEach(val => {
            if (val.includes('d')) {
                val = val.split('d')
                val[0] = val[0] ? +val[0] : 1
                totalValue += Math.round((val[0] + (+val[1] * val[0])) / 2)
            } else {
                totalValue += +val
            }
        })
    return totalValue
  }

  public rollDice(diceString) {
    if (typeof (diceString) === 'number') {
      return +Math.floor(Math.random() * Math.floor(diceString)) + 1
    } else if (!diceString) {
      return 0
    } else {
      let diceExpressionArray = []
      let expressionValue = ""

      diceString.replace(/\s/g, '').split('').forEach((val, i, array) => {
        if (val === '-' || val === '+') {
          diceExpressionArray.push(expressionValue)
          if (i !== array.length - 1) {
            diceExpressionArray.push(val)
          }
          expressionValue = ""
        }
        if (!isNaN(+val) || val === 'd' || val === "!") {
          expressionValue = expressionValue + val;
        }

        if (i === array.length - 1 && expressionValue !== '') {
          diceExpressionArray.push(expressionValue);
        }
      })

      for (let index = 0; index < diceExpressionArray.length; index++) {
        let val = diceExpressionArray[index];

        if (val.includes('d')) {
          val = val.split('d')
          let subtotal = 0
          for (let i = 0; i < val[0]; i++) {
            subtotal += this.rollDice(+val[1])
          }
          diceExpressionArray[index] = subtotal
        }
      }
      return eval(diceExpressionArray.join(""))
    }
  }
}
