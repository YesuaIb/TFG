import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

export const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent }
];
