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
  public challenges: any = 'loading'

  ngOnInit() {
    this.titleService.setTitle("Obstacle Index")
    let { params } = this.currentRoute.snapshot
    this.obstacleService.searchObstacles(params).subscribe(incomingObstacles => {
      this.obstacles = incomingObstacles.obstacles
      this.challenges = incomingObstacles.challenges
    })
    
    this.router.events.subscribe(p => {
      if (p instanceof NavigationEnd) {
        params = this.currentRoute.snapshot.params
        this.obstacles = 'loading'
        this.challenges = 'loading'
        this.obstacleService.searchObstacles(params).subscribe(incomingObstacles => {
          this.obstacles = incomingObstacles.obstacles
          this.challenges = incomingObstacles.challenges
        })
      }
    })
    this.titleService.setTitle('Obstacle Index')
  }
}
