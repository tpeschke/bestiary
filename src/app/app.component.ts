import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private metaService: Meta
  ) {  }

  ngOnInit() {
    this.metaService.updateTag( { name:'og:description', content: `The Bestiary for the Bonfire TTRPG`});
    this.metaService.updateTag( { name:'og:image', content: "https://bestiary.dragon-slayer.net/assets/TWRealFire.png"});
  }
}
