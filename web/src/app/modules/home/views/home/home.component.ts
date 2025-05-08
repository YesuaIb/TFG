import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokemonListComponent } from '../../../home/components/pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, PokemonListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
