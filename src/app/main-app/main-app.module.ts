import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BeastViewPlayerComponent } from './beast-view/beast-view-player/beast-view-player.component';
import { BeastViewGmComponent } from './beast-view/beast-view-gm/beast-view-gm.component';
import { MainAppShellComponent } from './main-app-shell/main-app-shell.component';

const routes: Routes = [
  
];

@NgModule({
  declarations: [SearchBarComponent, SearchResultsComponent, CatalogComponent, BeastViewPlayerComponent, BeastViewGmComponent, MainAppShellComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [SearchBarComponent, SearchResultsComponent, CatalogComponent, BeastViewPlayerComponent, BeastViewGmComponent, MainAppShellComponent]
})
export class MainAppModule { }
