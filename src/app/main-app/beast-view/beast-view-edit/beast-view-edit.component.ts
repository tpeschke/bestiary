import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeastService } from '../../../services/beast.service';

@Component({
  selector: 'app-beast-view-edit',
  templateUrl: './beast-view-edit.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewEditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beastService: BeastService
  ) { }

  public beast = {}
  public loggedIn = this.beastService.loggedIn || false;

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
    if (!this.beast) {
      this.beast = {id: '', 
        name: '', 
        hr: 0,
        intro: '',
        habitat: '',
        ecology: '',
        number_min: 0,
        number_max: 0,
        sense: '',
        diet: '',
        meta: '',
        sp_atk: '',
        sp_def: '',
        tactics: '',
        size: '',
        subsystem: 0,
        patreon: 0,
        vitality: '',
        panic: '',
        broken: '',
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`
      }
    }
  }

  captureHTML(event, type) {
    this.beast = Object.assign({}, this.beast, {[type]: event.html})
  }

  captureInput(event, type, index, secondaryType) {
    if (!secondaryType) {
      this.beast = Object.assign({}, this.beast, {[type]: event.target.value})
    } else {
      let newSecondaryObject = [...this.beast[type]]
      newSecondaryObject[index][secondaryType] = event.target.value
      this.beast = Object.assign({}, this.beast, {[type]: newSecondaryObject})
    }
  }

  saveChanges() {
    this.beastService.updateBeast(this.beast).subscribe(_=> this.router.navigate([`/main/beast/${this.route.snapshot.paramMap.get('id')}/gm`]))
  }

}
