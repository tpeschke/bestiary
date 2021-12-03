import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.css']
})
export class EditHomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  public editOrAdd = "Add"

  public obstacle = {}
  public challenge = {}

  public type = "obstacle"

  ngOnInit() {
    this.route.data.subscribe(data => {
      let obstacle = data['obstacle']
      if (obstacle) {
        this.editOrAdd = "Edit"
        if (obstacle.type === "obstacle") {
          this.obstacle = obstacle
        } else if (obstacle.type === "challenge") {
          this.challenge = obstacle
        }
      }
    })
  }

  selectType(event) {
    this.type = event.value
  }

}
