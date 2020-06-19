import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAppModule } from './main-app/main-app.module'

import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing.component';
import { MainAppShellComponent } from './main-app/main-app-shell/main-app-shell.component'
import { CatalogComponent } from './main-app/catalog/catalog.component';
import { BeastViewGmComponent } from './main-app/beast-view/beast-view-gm/beast-view-gm.component';
import { SearchResultsComponent } from './main-app/search-results/search-results.component';
import { BeastViewEditComponent } from './main-app/beast-view/beast-view-edit/beast-view-edit.component';
import { BeastViewPlayerComponent } from './main-app/beast-view/beast-view-player/beast-view-player.component';

import { BeastService } from './util/services/beast.service'
import { CalculatorService } from './util/services/calculator.service'
import { SingleBeastResolverService } from './util/guards-resolvers/single-beast-resolver.service'
import { PlayerBeastResolverService } from './util/guards-resolvers/player-beast-resolver.service'
import { CatalogResolverService } from './util/guards-resolvers/catalog-resolver.service';

import { ToastrModule } from 'ngx-toastr';

import { NoPlayerAuthService } from './util/guards-resolvers/no-player-auth.service'
import { NoGmAuthService } from './util/guards-resolvers/no-gm-auth.service'

const routes: Routes = [
  { path: 'login', component: LandingComponent, pathMatch: "full" },
  { path: 'main', component: MainAppShellComponent, children: [
    { path: '', redirectTo: 'catalog', pathMatch: "full"},
    { path: 'catalog', component: CatalogComponent, resolve: {catalog: CatalogResolverService}},
    { path: 'beast/:id/gm', component: BeastViewGmComponent, canActivate: [NoPlayerAuthService], resolve: {beast: SingleBeastResolverService}},
    { path: 'beast/:id/player', component: BeastViewPlayerComponent, canActivate: [NoGmAuthService], resolve: {beast: PlayerBeastResolverService}},
    { path: 'beast/:id/edit', component: BeastViewEditComponent, resolve: {beast: SingleBeastResolverService}},
    { path: 'search', component: SearchResultsComponent}
  ]},
  { path: '**', redirectTo: '' },
];
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MainAppModule,
    MatButtonModule,
    MatCardModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  providers: [BeastService, CalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
