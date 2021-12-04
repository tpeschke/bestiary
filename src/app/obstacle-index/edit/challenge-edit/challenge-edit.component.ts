import { Component, OnInit, Input, ViewChild } from '@angular/core';
import mermaid from "mermaid";
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css']
})
export class ChallengeEditComponent implements OnInit {
  @Input() challenge: any;
  @ViewChild("mermaid")
  public mermaidDiv;

  constructor(
    public obstacleService: ObstacleService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!this.challenge.name) {
      this.challenge = {
        id: null,
        type: 'challenge',
        name: null,
        flowchart: 'graph LR\nA[Christmas] -->|Get money| B(Go shopping)\nB --> C{Let me think}\nC -->|One| D[Laptop]\nC -->|Two| E[iPhone]\nC -->|Three| F[Test]',
        obstacleList: [],
        notes: ''
      }
    }
  }

  public ngAfterContentInit(): void {
    mermaid.initialize({
      theme: "neutral"
    });

    this.redrawGraph(this.challenge.flowchart)
  }

  captureInput(event, type) {
    this.challenge[type] = event.target.value
  }

  captureChange(event) {
    this.challenge.flowchart = event.target.value
    this.redrawGraph(event.target.value)
  }

  redrawGraph(graphDefinition) {
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render("graphDiv", graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      // this.setUpEventListeners()
      this.updateObstacleList()
    });
  }

  // this isn't needed here but will be needed on the display
  setUpEventListeners() {
    let nodes = Array.from(document.getElementsByClassName('node'));
    nodes.forEach(node => {
      let label = node.children.item(1).children.item(0).children.item(0).children.item(0).innerHTML
      // use label to attach id for pop up
      node.addEventListener('click', this.showInformation(label));
    })
  }

  updateObstacleList() {
    this.challenge.obstacleList = []
    let stringArray = this.challenge.flowchart.split('')
      , string = ""
      , isTracking = false

    stringArray.forEach(letter => {
      if (letter === ')' || letter === ']' || letter === '}') {
        isTracking = false
        this.challenge.obstacleList.push({ name: string, isLoading: true, valid: false })
        string = ""
      } else if (isTracking) {
        string += letter
      }
      if (letter === '(' || letter === '[' || letter === '{') {
        isTracking = true
      }
    })

    this.challenge.obstacleList.forEach((obstacle, i) => {
      this.obstacleService.checkIfObstacleIsValid(obstacle.name).subscribe(result => {
        this.challenge.obstacleList[i] = {...obstacle, isLoading: false, ...result }
      })
    })
  }

  showInformation(obstacle) {
    return function() {alert(`${obstacle}`)}
  }
  
  captureHTML(event, type) {
    this.challenge = Object.assign({}, this.challenge, { [type]: event.html })
  }

  saveChanges() {
    if (this.challenge.name) {
      this.obstacleService.updateObstacle(this.challenge).subscribe(_ => this.router.navigate([`/obstacle`]))
    }
  }

  deleteThis() {
    // this.obstacleService.deleteObstacle(this.obstacle.id).subscribe(_ => this.router.navigate([`/obstacle`]))
  }
}
