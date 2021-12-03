import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-obstacle-search-results',
  templateUrl: './obstacle-search-results.component.html',
  styleUrls: ['./obstacle-search-results.component.css']
})
export class ObstacleSearchResultsComponent implements OnInit {

  constructor(
    public router: Router,
    public currentRoute: ActivatedRoute,
    public obstacleService: ObstacleService,
    public titleService: Title,
  ) { }

  public obstacles: any = 'loading'

  ngOnInit() {
    let { params } = this.currentRoute.snapshot
    this.obstacleService.searchObstacles(params).subscribe(incomingObstacles => {
      this.obstacles = incomingObstacles
    })
    
    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        params = this.currentRoute.snapshot.params
        this.obstacles = 'loading'
        this.obstacleService.searchObstacles(params).subscribe(incomingObstacles => {
          this.obstacles = incomingObstacles
        })
      }
    })
    this.titleService.setTitle('Obstacle Index')
  }
}
