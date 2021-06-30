import { Injectable } from '@angular/core';
import { BeastService } from './beast.service';

@Injectable({
  providedIn: 'root'
})
export class QuickViewService {

  constructor(
    private beastService: BeastService
  ) { }

  public quickViewArray: any = [];

  addToQuickViewArray (beastid) {
    this.beastService.getQuickView(beastid).subscribe(results => {
      console.log(results)
      this.quickViewArray.push(results)
    })
  }
}
