import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAppModule } from './main-app/main-app.module'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing.component';
import { MainAppShellComponent } from './main-app/main-app-shell/main-app-shell.component'
import { CatalogComponent } from './main-app/catalog/catalog.component';
import { BeastViewGmComponent } from './main-app/beast-view/beast-view-gm/beast-view-gm.component';
import { SearchResultsComponent } from './main-app/search-results/search-results.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: "full" },
  { path: 'main', component: MainAppShellComponent, children: [
    { path: '', redirectTo: 'search', pathMatch: "full"},
    { path: 'catalog', component: CatalogComponent},
    { path: 'beast/:id/gm', component: BeastViewGmComponent},
    { path: 'search', component: SearchResultsComponent},
  ]},
  { path: '**', redirectTo: '' },
];
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MainAppModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
