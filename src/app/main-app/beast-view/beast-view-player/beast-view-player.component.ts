import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import variables from '../../../../local.js'
import { BeastService } from 'src/app/util/services/beast.service.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beast-view-player',
  templateUrl: './beast-view-player.component.html',
  styleUrls: ['../beast-view.component.css']
})
export class BeastViewPlayerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private beastService: BeastService,
    private toastr: ToastrService
  ) { }

  public beast = {name: null, id: null, notes: null}
  public imageBase = variables.imageBase;
  public edit = false

  ngOnInit() {
    this.beast = this.route.snapshot.data['beast'];
  }

  toggleEdit() {
    this.edit = !this.edit
  }

  captureHTML(event) {
    if (event.editor.getLength() > 500) {
      event.editor.deleteText(500, event.editor.getLength());
      this.toastr.warning('', "You've hit the character limit for this entry.")
    } else {
      this.beast.notes = Object.assign({}, this.beast.notes, {notes: event.html} )
    }
  }

  saveNotes() {
    this.beastService.addPlayerNotes({beastId: this.beast.id, noteId: this.beast.notes.id, notes: this.beast.notes.notes}).subscribe(result => {
      this.toggleEdit()
    })
  }

}
