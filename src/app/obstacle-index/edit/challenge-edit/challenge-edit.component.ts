import { Component, OnInit, Input, ViewChild } from '@angular/core';
import mermaid from "mermaid";
import { element } from 'protractor';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css']
})
export class ChallengeEditComponent implements OnInit {
  @Input() challenge: any;
  @ViewChild("mermaid")
  public mermaidDiv;

  constructor() { }

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

  // this isn't needed here
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
        this.challenge.obstacleList.push({ name: string })
        // check if obstacle exists and mark with checkmark or x
        // return with id and attach it to obstacle list
        string = ""
      } else if (isTracking) {
        string += letter
      }
      if (letter === '(' || letter === '[' || letter === '{') {
        isTracking = true
      }
    })
  }

  showInformation(obstacle) {
    return function() {alert(`${obstacle}`)}
  }
}
