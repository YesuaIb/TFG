import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
})
export class PokemonDetailComponent {
  pokemonDetail: any;
  evolutionChain: any[] = [];
  url: string = 'http://localhost:8000';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.loadPokemon(id);
        this.loadEvoluciones(id);
      }
    });
  }

  loadPokemon(id: number) {
    const cached = this.apiService.getCachedPokemon(id);
    if (cached) {
      this.pokemonDetail = cached;
      console.log('Pokemon:', this.pokemonDetail);

    } else {
      this.apiService.getPokemon(id).subscribe((data) => {
        this.pokemonDetail = data;
        this.apiService.savePokemonToCache(id, data);
      });
    }
  }


  getFloat(numero: number): string {
    return (numero / 10).toFixed(2);
  }

  loadEvoluciones(id: number): void {
    const cached = this.apiService.getCachedEvoluciones(id);

    if (cached) {
      this.evolutionChain = cached.lineaEvolutiva;
    } else {
      this.apiService.getEvoluciones(id).subscribe((data) => {
        this.evolutionChain = data.lineaEvolutiva;
        this.apiService.saveEvolucionesToCache(id, data);
      });
    }
  }


}
