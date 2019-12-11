import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAppModule } from './main-app/main-app.module'

import {MatButtonModule} from '@angular/material/button';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing.component';
import { MainAppShellComponent } from './main-app/main-app-shell/main-app-shell.component'
import { CatalogComponent } from './main-app/catalog/catalog.component';
import { BeastViewGmComponent } from './main-app/beast-view/beast-view-gm/beast-view-gm.component';
import { SearchResultsComponent } from './main-app/search-results/search-results.component';
import { BeastViewEditComponent } from './main-app/beast-view/beast-view-edit/beast-view-edit.component';

import { BeastService } from './services/beast.service'
import { SingleBeastResolverService } from './services/single-beast-resolver.service'
import { CatalogResolverService } from './services/catalog-resolver.service';
import { ToastrModule } from 'ngx-toastr';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: "full" },
  { path: 'main', component: MainAppShellComponent, children: [
    { path: '', redirectTo: 'catalog', pathMatch: "full"},
    { path: 'catalog', component: CatalogComponent, resolve: {catalog: CatalogResolverService}},
    { path: 'beast/:id/gm', component: BeastViewGmComponent, resolve: {beast: SingleBeastResolverService}},
    { path: 'beast/:id/edit', component: BeastViewEditComponent, resolve: {beast: SingleBeastResolverService}},
    { path: 'search', component: SearchResultsComponent},
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
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [BeastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
