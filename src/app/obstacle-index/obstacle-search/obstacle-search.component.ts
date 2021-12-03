import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obstacle-search',
  templateUrl: './obstacle-search.component.html',
  styleUrls: ['./obstacle-search.component.css']
})
export class ObstacleSearchComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  queryObject: any = {}

  enterSearchEvery (e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, search: e.target.value }
      this.router.navigate(['/obstacle/search', { ...this.queryObject, search: e.target.value }]);
    } else if (e.value===undefined || e.target.value === '') {
      delete this.queryObject.search
      this.router.navigate(['/obstacle/search', { ...this.queryObject }]);
    }
  }
}
