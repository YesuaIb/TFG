import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/views/home/home.component';
import { PokemonDetailComponent } from './modules/home/components/pokemon-detail/pokemon-detail.component';
import { TeamsComponent } from './modules/teams/views/teams/teams.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: 'teams', component: TeamsComponent }
];
