import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../util/services/beast.service';
import { CalculatorService } from '../../util/services/calculator.service';
import variables from '../../../local.js'
import { HewyRatingComponent } from '../../hewy-rating/hewy-rating.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-beast-view-gm',
  templateUrl: './beast-view-gm.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewGmComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private calculatorService: CalculatorService,
    private dialog: MatDialog,
    public router: Router
  ) { }

  public beast = { id: null, name: null, vitality: null, favorite: false, number_min: null, number_max: null }
  public encounter: any = "loading";
  public loggedIn = this.beastService.loggedIn || false;
  public imageBase = variables.imageBase;
  public averageVitality = null
  public checkboxes = []

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.beast = data['beast']
      this.getRandomEncounter()
      this.averageVitality = this.calculatorService.calculateAverageOfDice(this.beast.vitality)

      let tired = 1
        , hurt = Math.floor(this.averageVitality * .25)
        , bloodied = Math.floor(this.averageVitality * .5)
        , wounded = Math.floor(this.averageVitality * .75)

      for (let i = 0; i < this.averageVitality; i++) {
        switch (i) {
          case tired:
            this.checkboxes.push({ value: 'T' })
            break;
          case hurt:
            this.checkboxes.push({ value: 'H' })
            break;
          case bloodied:
            this.checkboxes.push({ value: 'B' })
            break;
          case wounded:
            this.checkboxes.push({ value: 'W' })
            break;
          default:
            break;
        }
        this.checkboxes.push({ checked: false })
      }
    })
  }

  checkCheckbox(event, index) {
    this.checkboxes = this.checkboxes.map((box, i) => {
      if (box.value) {
        return box
      } else {
        if (i === 0 && index === 0) {
          return { checked: event.checked }
        } else if (i <= index) {
          return { checked: true }
        } else {
          return { checked: false }
        }
      }
    })
  }

  openExplaination() {
    this.dialog.open(HewyRatingComponent);
  }

  navigateToSearch(type, search) {
    this.router.navigate(['/search', { [type]: search }]);
  }

  isNumber(val): boolean { 
    return !isNaN(+val); 
  }

  addFavorite(beastid) {
    this.beastService.addFavorite(beastid).subscribe(result => {
      if (result.message === 'Monster Favorited') {
        this.beast.favorite = true
      }
    })
  }

  deleteFavorite(beastid) {
    this.beastService.deleteFavorite(beastid).subscribe(_ => {
      this.beast.favorite = false
    })
  }

  getRandomEncounter() {
    this.encounter = 'loading'
    this.beastService.getRandomEncounter(this.beast.id).subscribe((result: any) => {
      result.number = this.calculatorService.rollDice(`${this.beast.number_min}d${this.beast.number_max}`)
      result.timeOfDay = this.calculatorService.rollDice(12)
      let partOfDay = this.calculatorService.rollDice(2)
      result.timeOfDay += partOfDay === 1 ? " AM" : " PM";
      this.encounter = result
    })
  }

}
