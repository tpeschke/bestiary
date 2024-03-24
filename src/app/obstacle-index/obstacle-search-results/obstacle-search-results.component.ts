import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import { Title, Meta } from "@angular/platform-browser";

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
    public metaService: Meta
  ) { }

  public obstacles: any = 'loading'
  public challenges: any = 'loading'

  ngOnInit() {
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
    this.metaService.updateTag( { name:'og:description', content: 'An Index of Obstacle for the Bonfire TTRPG'});
    this.metaService.updateTag( { name:'og:image', content: "https://bestiary.stone-fish.com/assets/TWRealFire.png"});
  }
}
