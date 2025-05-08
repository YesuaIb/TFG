import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {
  pokemonList: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    const pokemonIds = [1, 2, 3, 4, 7, 10, 13, 16, 19, 25, 37, 50, 54, 87, 133, 142, 200, 280, ];
  
    pokemonIds.forEach(id => {
      this.apiService.getPokemonWithTypes(id.toString()).subscribe((data) => {
        this.pokemonList.push(data);
        this.pokemonList.sort((a, b) => a.id - b.id);
      });
    });
  }
}
