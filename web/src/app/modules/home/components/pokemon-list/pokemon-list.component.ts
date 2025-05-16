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
  url: string = 'http://localhost:8000';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const cached = this.apiService.getCachedAllPokemons();

    if (cached && cached.length > 0) {
      this.pokemonList = cached;
      console.log('Usando caché de Pokémon');
    } else {
      this.apiService.getAllPokemons().subscribe((data: any) => {
        this.pokemonList = data['member'];
        this.apiService.saveAllPokemonsToCache(data['member']); // Guarda en caché
        console.log('Pokémon descargados y guardados en caché');
      });
    }
  }
}
