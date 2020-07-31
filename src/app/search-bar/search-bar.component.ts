import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatExpansionPanel } from '@angular/material';

class QueryObject {
  name?: string
  body?: string
  minHr?: string
  maxHr?: string
  minAppearing?: string
  maxAppearing?: string
  minInt?: string
  maxInt?: string
  size?: string
  access?: number
  subsystem?: number
  personalNotes?: boolean
  environ?: any
  types?: any
}
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  
  constructor(
    public router: Router
  ) { }

  public queryObject: QueryObject = {}
  public environ = []
  public types = []

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!event.url.includes('search')) {
          this.viewPanels.forEach(p => p.close());
        }
      }
    });
  }

  enterSearchName(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, name: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, name: e.target.value }]);
    } else if (e.value===undefined || e.target.value === '') {
      delete this.queryObject.name
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchBody(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, body: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, body: e.target.value }]);
    } else if (e.target.value === undefined || e.target.value === '') {
      delete this.queryObject.body
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMinHr(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, minHr: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, minHr: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.minHr
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMaxHr(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, maxHr: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, maxHr: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.maxHr
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMinAppearing(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, minAppearing: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, minAppearing: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.minAppearing
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMaxAppearing(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, maxAppearing: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, maxAppearing: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.maxAppearing
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMinInt(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, minInt: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, minInt: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.minInt
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchMaxInt(e) {
    if (e.target.value && e.target.value !== '') {
      this.queryObject = { ...this.queryObject, maxInt: e.target.value }
      this.router.navigate(['/main/search', { ...this.queryObject, maxInt: e.target.value }]);
    } else if (e.target.value===undefined || e.target.value === '') {
      delete this.queryObject.maxInt
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchSize(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, size: e.value }
      this.router.navigate(['/main/search', { ...this.queryObject, size: e.value }]);
    } else if (e.value===undefined) {
      delete this.queryObject.size
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchAccess(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, access: +e.value }
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    } else if (e.value===undefined) {
      delete this.queryObject.access
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchSubsystem(e) {
    if (e.value) {
      this.queryObject = { ...this.queryObject, subsystem: +e.value }
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    } else if (e.value===undefined) {
      delete this.queryObject.subsystem
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchPersonalNotes(e) {
    if (e.checked) {
      this.queryObject = { ...this.queryObject, personalNotes: e.checked }
      this.router.navigate(['/main/search', { ...this.queryObject, personalNotes: e.checked }]);
    } else {
      delete this.queryObject.personalNotes
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    }
  }

  enterSearchTypes(id, e) {
    if (e.checked) {
      this.types.push(id)
    } else {
      let index = this.types.indexOf(id)
      this.types.splice(index, 1)
    }
    if (this.types.length === 0) {
      delete this.queryObject.types
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    } else {
      this.queryObject = { ...this.queryObject, types: this.types }
      this.router.navigate(['/main/search', { ...this.queryObject, types: this.types }]);
    }
  }

  enterSearchEnvirons(id, e) {
    if (e.checked) {
      this.environ.push(id)
    } else {
      let index = this.environ.indexOf(id)
      this.environ.splice(index, 1)
    }
    if (this.environ.length === 0) {
      delete this.queryObject.environ
      this.router.navigate(['/main/search', { ...this.queryObject }]);
    } else {
      this.queryObject = { ...this.queryObject, environ: this.environ }
      this.router.navigate(['/main/search', { ...this.queryObject, environ: this.environ }]);
    }
  }


}
