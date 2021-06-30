import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuickViewService {

  constructor() { }

  public quickViewArray: any = [];

  addToQuickViewArray (beastid) {
    this.quickViewArray.push(beastid)
  }
}
