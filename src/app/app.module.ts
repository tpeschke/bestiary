import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BeastViewPlayerComponent } from './beast-view/beast-view-player/beast-view-player.component';
import { BeastViewGmComponent } from './beast-view/beast-view-gm/beast-view-gm.component';
import { BeastViewEditComponent } from './beast-view/beast-view-edit/beast-view-edit.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule } from '@angular/forms';
import { TypeConverterPipe } from './util/pipes/type-converter.pipe';
import { EnvironConverterPipe } from './util/pipes/environ-converter.pipe';
import { MoraleConverterPipe } from './util/pipes/morale-converter.pipe'
import { SubsystemConverterPipe } from './util/pipes/subsystem-converter.pipe';
import { HewyRatingComponent } from './hewy-rating/hewy-rating.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayerNotesComponent } from './player-notes/player-notes.component';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BeastService } from './util/services/beast.service'
import { CalculatorService } from './util/services/calculator.service'
import { SingleBeastResolverService } from './util/guards-resolvers/single-beast-resolver.service'
import { PlayerBeastResolverService } from './util/guards-resolvers/player-beast-resolver.service'
import { CatalogResolverService } from './util/guards-resolvers/catalog-resolver.service';

import { ToastrModule } from 'ngx-toastr';

import { NoPlayerAuthService } from './util/guards-resolvers/no-player-auth.service'
import { NoGmAuthService } from './util/guards-resolvers/no-gm-auth.service'

const routes: Routes = [
  { path: '', component: CatalogComponent, resolve: { catalog: CatalogResolverService } },
  { path: 'beast/:id/gm', component: BeastViewGmComponent, canActivate: [NoPlayerAuthService], resolve: { beast: SingleBeastResolverService } },
  { path: 'beast/:id/player', component: BeastViewPlayerComponent, canActivate: [NoGmAuthService], resolve: { beast: PlayerBeastResolverService } },
  { path: 'beast/:id/edit', component: BeastViewEditComponent, resolve: { beast: SingleBeastResolverService } },
  { path: 'search', component: SearchResultsComponent },
  { path: '**', redirectTo: '' },
];
@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent, 
    SearchResultsComponent, 
    CatalogComponent, 
    BeastViewPlayerComponent, 
    BeastViewGmComponent,
    BeastViewEditComponent,
    TypeConverterPipe,
    EnvironConverterPipe,
    MoraleConverterPipe,
    SubsystemConverterPipe,
    HewyRatingComponent,
    PlayerNotesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    MatChipsModule,
    MatDialogModule,
    FormsModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  entryComponents: [HewyRatingComponent],
  providers: [BeastService, CalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
