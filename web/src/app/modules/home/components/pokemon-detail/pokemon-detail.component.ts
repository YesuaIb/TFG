import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
})
export class PokemonDetailComponent implements OnInit {
  pokemonDetail: any;
  description: string = '';
  evolutionChain: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // 1. Datos del Pokémon
    this.apiService.getPokemonWithTypes(id).subscribe((data) => {
      this.pokemonDetail = data;
    });

    // 2. Especie + Descripción + Evoluciones
    this.apiService.getPokemonSpecies(id).subscribe((species) => {
      const flavorText = species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'es'
      );

      this.description = flavorText
        ? flavorText.flavor_text.replace(/\n|\f/g, ' ')
        : 'Descripción no disponible.';

      // 3. Cadena de evolución
      if (species.evolution_chain?.url) {
        this.apiService.getEvolutionChain(species.evolution_chain.url).subscribe(chainData => {
          const evolutions = this.extractEvolutions(chainData.chain);
          evolutions.shift();

          // Obtener el ID para cada evolución para mostrar su imagen
          evolutions.forEach(evo => {
            this.apiService.getPokemonWithTypes(evo.name).subscribe(pokeData => {
              evo.id = pokeData.id;
            });
          });

          this.evolutionChain = evolutions;
        });
      }
    });
  }

  // Método para extraer la cadena de evoluciones
  extractEvolutions(chain: any): any[] {
    const evolutions: any[] = [];
    let current = chain;

    while (current) {
      evolutions.push({ name: current.species.name });
      current = current.evolves_to[0];
    }

    return evolutions;
  }
}
