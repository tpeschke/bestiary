import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SearchBarComponent } from './search/search-bar/search-bar.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { BeastViewPlayerComponent } from './beast-view/beast-view-player/beast-view-player.component';
import { BeastViewGmComponent } from './beast-view/beast-view-gm/beast-view-gm.component';
import { BeastViewEditComponent } from './beast-view/beast-view-edit/beast-view-edit.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeConverterPipe } from './util/pipes/type-converter.pipe';
import { MoraleConverterPipe } from './util/pipes/morale-converter.pipe'
import { SubsystemConverterPipe } from './util/pipes/subsystem-converter.pipe';
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
import { NoNonOwnerService } from './util/guards-resolvers/no-non-owner-auth.service'
import { NoGmAuthService } from './util/guards-resolvers/no-gm-auth.service';
import { RarityConverterPipe } from './util/pipes/rarity-converter.pipe';
import { QuickViewDrawerComponent } from './quick-view/quick-view-drawer.component';
import { WeirdShapingEditComponent } from './weird-shaping/weird-shaping-edit/weird-shaping-edit.component';
import { WeirdShapingDisplayComponent } from './weird-shaping/weird-shaping-display/weird-shaping-display.component';
import { BestiaryHomeComponent } from './bestiary-home/bestiary-home.component';
import { ObstacleCatalogComponent } from './obstacle-index/obstacle-catalog/obstacle-catalog.component';
import { ObstacleHomeComponent } from './obstacle-index/obstacle-home/obstacle-home.component';
import { ObstacleEditComponent } from './obstacle-index/edit/obstacle-edit/obstacle-edit.component'
import { GetObstacleService } from './util/guards-resolvers/get-obstacle.service';
import { ObstaclePopUpComponent } from './obstacle-index/obstacle-pop-up/obstacle-pop-up.component';
import { ObstacleSearchComponent } from './obstacle-index/obstacle-search/obstacle-search.component';
import { ObstacleSearchResultsComponent } from './obstacle-index/obstacle-search-results/obstacle-search-results.component';
import { DifficultyMatrixComponent } from './obstacle-index/difficulty-matrix/difficulty-matrix.component';
import { ChallengeEditComponent } from './obstacle-index/edit/challenge-edit/challenge-edit.component';
import { EditHomeComponent } from './obstacle-index/edit/edit-home/edit-home.component';
import { ChallengePopUpComponent } from './obstacle-index/view/challenge-pop-up/challenge-pop-up.component';
import { ChallengeShellComponent } from './obstacle-index/view/challenge-shell/challenge-shell.component';
import { ObstacleInnardsComponent } from './obstacle-index/view/obstacle-innards/obstacle-innards.component';
import { SkillDisplayComponent } from './beast-view/beast-view-edit/skill-display/skill-display.component';
import { BurdenDisplayComponent } from './beast-view/beast-view-edit/burdens-display/burden-display.component';
import { ChallengeInnardsComponent } from './obstacle-index/view/challenge-innards/challenge-innards.component';
import { CombatInfoComponent } from './beast-view/beast-view-edit/combat-info/combat-info.component';
import { MentalPhysicalDisplayComponent } from './beast-view/beast-view-edit/mental-physical-display/mental-physical-display.component';
import { CombatSquareComponent } from './beast-view/beast-view-gm/combat-square/combat-square.component';
import { EditTableComponent } from './beast-view/beast-view-edit/edit-table/edit-table.component';
import { ViewTableComponent } from './beast-view/beast-view-gm/view-table/view-table.component';
import { CombatTableComponent } from './util/combat-table/combat-table.component';
import { CharacteristicDisplayComponent } from './beast-view/beast-view-edit/characteristic-display/characteristic-display.component';
import { MatSliderModule } from '@angular/material/slider';
import { CustomCatalogComponent } from './catalogs/custom-catalog/custom-catalog.component';
import { PatreonAuthService } from './util/guards-resolvers/patreon-auth.service';
import { PleromaDisplayComponent } from './beast-view/beast-view-edit/pleroma-display/pleroma-display.component';
import { RandomEncountersListComponent } from './random-encounters/random-encounters-list/random-encounters-list.component';
import { RandomEncounterListService } from './util/guards-resolvers/random-encounter-list.service';
import { AddToListPopUpComponent } from './random-encounters/add-to-list-pop-up/add-to-list-pop-up.component';
import { CatalogComponent } from './catalogs/catalog/catalog.component';
import { ListViewPopUpComponent } from './random-encounters/list-view-pop-up/list-view-pop-up.component';
import { EquipmentDisplayComponent } from './beast-view/beast-view-edit/equipment-display/equipment-display.component';
import { CombatDisplayComponent } from './beast-view/beast-view-edit/combat-display/combat-display.component';
import { VitalityFatigueDisplayComponent } from './beast-view/beast-view-edit/combat-display/vitality-fatigue-display/vitality-fatigue-display.component';
import { MovementDisplayComponent } from './beast-view/beast-view-edit/combat-display/movement-display/movement-display.component';
import { DefenseDisplayComponent } from './beast-view/beast-view-edit/combat-display/defense-display/defense-display.component';
import { AttackDisplayComponent } from './beast-view/beast-view-edit/combat-display/attack-display/attack-display.component';
import { SingleDefenseDisplayComponent } from './beast-view/beast-view-edit/combat-display/defense-display/single-defense-display/single-defense-display.component';
import { SingleAttackDisplayComponent } from './beast-view/beast-view-edit/combat-display/attack-display/single-attack-display/single-attack-display.component';

const routes: Routes = [
  {
    path: 'obstacle',
    component: ObstacleHomeComponent,
    children: [
      { path: 'view/:id', component: ChallengeShellComponent },
      { path: 'edit/:id', component: EditHomeComponent, resolve: { obstacle: GetObstacleService } },
      { path: 'search', component: ObstacleSearchResultsComponent },
      { path: ':id', component: ObstacleCatalogComponent, resolve: { catalog: CatalogResolverService } },
      { path: ':id/:difficulty', component: ObstacleCatalogComponent, resolve: { catalog: CatalogResolverService } },
      { path: '', component: ObstacleCatalogComponent, resolve: { catalog: CatalogResolverService } },
      { path: '**', redirectTo: '' },
    ]
  },
  {
    path: '',
    component: BestiaryHomeComponent,
    children: [{ path: '', component: CatalogComponent, resolve: { catalog: CatalogResolverService } },
    { path: 'beast/:id/gm', component: BeastViewGmComponent, canActivate: [NoPlayerAuthService], resolve: { beast: SingleBeastResolverService } },
    { path: 'beast/:id/gm/:role', component: BeastViewGmComponent, canActivate: [NoPlayerAuthService], resolve: { beast: SingleBeastResolverService } },
    { path: 'beast/:id/gm/:role/:modifier', component: BeastViewGmComponent, canActivate: [NoPlayerAuthService], resolve: { beast: SingleBeastResolverService } },
    { path: 'beast/:id/player', component: BeastViewPlayerComponent, canActivate: [NoGmAuthService], resolve: { beast: PlayerBeastResolverService } },
    { path: 'beast/:id/edit', component: BeastViewEditComponent, canActivate: [NoNonOwnerService], resolve: { beast: SingleBeastResolverService } },
    { path: 'search', component: SearchResultsComponent },
    { path: 'search/:savedRoute', component: SearchResultsComponent },
    { path: 'lists', component: RandomEncountersListComponent, resolve: { lists: RandomEncounterListService } },
    { path: 'lists/:listid', component: RandomEncountersListComponent, resolve: { lists: RandomEncounterListService } },
    { path: 'lists/:listid/directlyTo', component: RandomEncountersListComponent, resolve: { lists: RandomEncounterListService } },
    { path: 'custom', component: CustomCatalogComponent, canActivate: [PatreonAuthService] },
    { path: '**', redirectTo: '' }
    ]
  },
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
    MoraleConverterPipe,
    SubsystemConverterPipe,
    PlayerNotesComponent,
    RarityConverterPipe,
    QuickViewDrawerComponent,
    WeirdShapingEditComponent,
    WeirdShapingDisplayComponent,
    BestiaryHomeComponent,
    ObstacleCatalogComponent,
    ObstacleHomeComponent,
    ObstacleEditComponent,
    ObstaclePopUpComponent,
    AddToListPopUpComponent,
    ObstacleSearchComponent,
    ObstacleSearchResultsComponent,
    DifficultyMatrixComponent,
    ChallengeEditComponent,
    EditHomeComponent,
    ListViewPopUpComponent,
    ChallengePopUpComponent,
    ChallengeShellComponent,
    ObstacleInnardsComponent,
    CombatInfoComponent,
    MentalPhysicalDisplayComponent,
    CharacteristicDisplayComponent,
    SkillDisplayComponent,
    BurdenDisplayComponent,
    ChallengeInnardsComponent,
    CombatSquareComponent,
    EditTableComponent,
    ViewTableComponent,
    CombatTableComponent,
    CustomCatalogComponent,
    PleromaDisplayComponent,
    RandomEncountersListComponent,
    EquipmentDisplayComponent,
    CombatDisplayComponent,
    VitalityFatigueDisplayComponent,
    MovementDisplayComponent,
    DefenseDisplayComponent,
    SingleDefenseDisplayComponent,
    AttackDisplayComponent,
    SingleAttackDisplayComponent
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
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  entryComponents: [ObstaclePopUpComponent, AddToListPopUpComponent, ListViewPopUpComponent, DifficultyMatrixComponent, ChallengePopUpComponent],
  providers: [BeastService, CalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }