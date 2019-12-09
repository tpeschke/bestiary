import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BeastViewPlayerComponent } from './beast-view/beast-view-player/beast-view-player.component';
import { BeastViewGmComponent } from './beast-view/beast-view-gm/beast-view-gm.component';
import { MainAppShellComponent } from './main-app-shell/main-app-shell.component';
import { BeastViewEditComponent } from './beast-view/beast-view-edit/beast-view-edit.component';

@NgModule({
  declarations: [SearchBarComponent, SearchResultsComponent, CatalogComponent, BeastViewPlayerComponent, BeastViewGmComponent, MainAppShellComponent, BeastViewEditComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    HttpClientModule,
    MatChipsModule
  ],
  exports: [SearchBarComponent, SearchResultsComponent, CatalogComponent, BeastViewPlayerComponent, BeastViewGmComponent, MainAppShellComponent]
})
export class MainAppModule { }
