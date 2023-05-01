import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  calculateAverageOfDice(diceString) {
    let totalValue = 0
    if (!diceString) {
      return 0
    }
    diceString
      .replace(/!| /g, '')
      .split('+')
      .forEach(val => {
        if (val.includes('d')) {
          if (val.includes('*')) {
            val = val.replace(/\(|\)/gi, '').split('*')
            let dice = val[0].split('d')
            dice[0] = val[1]
            totalValue += Math.round((+dice[0] + (+dice[1] * dice[0])) / 2)
          } else {
            val = val.split('d')
            val[0] = val[0] ? +val[0] : 1
            totalValue += Math.round((val[0] + (+val[1] * val[0])) / 2)
          }
        } else {
          totalValue += +val
        }
      })
    return totalValue
  }

  public rollDice = (diceString) => {
    if (typeof (+diceString) === 'number') {
      if (+diceString === 0) {
        return 0
      }
      return +Math.floor(Math.random() * Math.floor(diceString)) + 1
    } else {
      let diceExpressionArray = []
      let expressionValue = ""

      diceString.replace(/\s/g, '').split('').forEach((val, i, array) => {
        if (val === '-' || val === '+' || val === '*') {
          diceExpressionArray.push(expressionValue)
          if (i !== array.length - 1) {
            diceExpressionArray.push(val)
          }
          expressionValue = ""
        }
        if (!isNaN(+val) || val === 'd' || val === "!") {
          val = val.replace(/!/i, "")
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
          if (val[0] === "") { val[0] = 1 }
          for (let i = 0; i < +val[0]; i++) {
            subtotal += this.rollDice(+val[1])
          }
          diceExpressionArray[index] = subtotal
        }
      }

      return eval(diceExpressionArray.join(""))
    }
  }
}
