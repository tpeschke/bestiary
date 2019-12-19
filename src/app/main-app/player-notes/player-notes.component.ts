import { Component, OnInit, Input } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-player-notes',
  templateUrl: './player-notes.component.html',
  styleUrls: ['./player-notes.component.css']
})
export class PlayerNotesComponent implements OnInit {

  @Input() notes: {id: number, notes: string}
  @Input() id: number

  constructor(
    private beastService: BeastService,
    private toastr: ToastrService
    ) { }

  public edit = false

  ngOnInit() {
  }

  
  toggleEdit() {
    this.edit = !this.edit
  }

  captureHTML(event) {
    if (event.editor.getLength() > 500) {
      event.editor.deleteText(500, event.editor.getLength());
      this.toastr.warning('', "You've hit the character limit for this entry.")
    } else {
      this.notes = Object.assign({}, this.notes, {notes: event.html} )
    }
  }

  saveNotes() {
    this.beastService.addPlayerNotes({beastId: this.id, noteId: this.notes.id, notes: this.notes.notes}).subscribe(result => {
      this.toggleEdit()
    })
  }

}
