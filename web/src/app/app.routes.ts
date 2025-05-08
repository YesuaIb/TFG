import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/views/home/home.component';
import { PokemonDetailComponent } from './modules/home/components/pokemon-detail/pokemon-detail.component';
import { TeamsComponent } from './modules/teams/views/teams/teams.component';
import { TeamBuilderComponent } from './modules/teams/components/team-builder/team-builder.component';
import { LoginComponent } from './modules/auth/views/login/login.component';
import { RegisterComponent } from './modules/auth/views/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/create', component: TeamBuilderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
