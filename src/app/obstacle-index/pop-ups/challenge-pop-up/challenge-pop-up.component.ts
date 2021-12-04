import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import mermaid from "mermaid";
import { ToastrService } from 'ngx-toastr';
import { ObstaclePopUpComponent } from '../obstacle-pop-up/obstacle-pop-up.component.js';

@Component({
  selector: 'app-challenge-pop-up',
  templateUrl: './challenge-pop-up.component.html',
  styleUrls: ['./challenge-pop-up.component.css']
})
export class ChallengePopUpComponent implements OnInit {
  @ViewChild("mermaid")
  public mermaidDiv;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<ChallengePopUpComponent>,
    public obstacleService: ObstacleService,
    public beastService: BeastService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  public challenge: any = {}
  public loggedIn: boolean | string | number = false;
  public loginEndpoint = variables.login

  ngOnInit() {
    this.obstacleService.getObstacle(this.data.id, 'challenge').subscribe(challenge => {
      this.challenge = challenge
      setTimeout(() => this.initMermaid(this.challenge.flowchart), 500)
    })
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }

  public initMermaid(graphDefinition): void {
    mermaid.initialize({
      theme: "neutral"
    });
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render("graphDiv", graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      this.setUpEventListeners()
    });
  }

  goToEdit() {
    this.dialogRef.close();
    this.router.navigate([`/obstacle/edit/${this.challenge.id}`])
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setUpEventListeners() {
    let nodes = Array.from(document.getElementsByClassName('node'));
    nodes.forEach(node => {
      let label = node.children.item(1).children.item(0).children.item(0).children.item(0).innerHTML
      this.obstacleService.checkIfObstacleIsValid(label).subscribe(result => {
        if (result.id) {
          node.addEventListener('click', this.showPopup(result.id));
        } else {
          node.addEventListener('click', this.showError(label));
        }
      })
    })
  }

  showPopup = (id) => {
    return () => {
      this.dialog.open(ObstaclePopUpComponent, { width: '400px', data: { id }});
    }
  }

  handleMessage (message) {
    this.toastr.error(message)
  }

  showError(label) {
    let handleMessage = this.handleMessage.bind(this);
    return function() {
      handleMessage(`"${label}" doesn't currently have a valid Obstacle associated with it`)
    }
  }

}
