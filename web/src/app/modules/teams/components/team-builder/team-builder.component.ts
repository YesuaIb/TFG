import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-builder.component.html',
  styleUrl: './team-builder.component.scss'
})
export class TeamBuilderComponent {
  @Output() effectivenessChange = new EventEmitter<{ fuertesContra: any, debilContra: any }>();

  team: any[] = new Array(6).fill(null);
  filteredLists = new Array(6).fill([]);
  dropdowns: boolean[] = new Array(6).fill(false);
  allPokemon: any[] = [];

  url = 'http://localhost:8000';

  constructor(private apiservice: ApiService) { }

  ngOnInit(): void {
    this.apiservice.getAllPokemons().subscribe((data: any) => {
      this.allPokemon = data['member'];
    });
  }

  toggleDropdown(index: number): void {
    this.dropdowns = this.dropdowns.map((_, i) => i === index ? !this.dropdowns[i] : false);

    if (this.dropdowns[index]) {
      const selectedIds = this.team.map(p => p?.id).filter(id => id !== null);
      this.filteredLists[index] = this.allPokemon.filter(p =>
        !selectedIds.includes(p.id) || this.team[index]?.id === p.id
      );
    }
  }

  closeDropdown(index: number): void {
    this.dropdowns[index] = false;
  }

  clearPokemon(index: number): void {
    this.team[index] = null;
    this.dropdowns[index] = false;
    this.emitEffectiveness();
  }

  onPokemonSelected(index: number, pokemonId: number): void {
    this.apiservice.getPokemon(pokemonId).subscribe(pokemon => {
      this.team[index] = pokemon;
      this.dropdowns[index] = false;
      this.calcularEfectividad();
    });
  }

  emitEffectiveness(): void {
    const tipoIds = new Set<number>();

    this.team.forEach(pokemon => {
      if (pokemon?.tipos) {
        pokemon.tipos.forEach((tipo: any) => {
          if (tipo.id) tipoIds.add(tipo.id);
        });
      }
    });

    const ids = Array.from(tipoIds);
    if (ids.length === 0) {
      this.effectivenessChange.emit({ fuertesContra: {}, debilContra: {} });
      return;
    }

    const requests = ids.map(id => this.apiservice.getEfectividad(id));
    forkJoin(requests).subscribe((respuestas: any[]) => {

      const fuertes: Record<string, number> = {};
      const debiles: Record<string, number> = {};

      respuestas.forEach(respuesta => {
        const eficacia = respuesta.eficacia as Record<string, number>;

        Object.entries(eficacia).forEach(([tipo, valor]) => {
          console.log(`✔️ ${tipo} -> ${valor}`);
          if (valor > 1) {
            fuertes[tipo] = (fuertes[tipo] || 1) * valor;
          } else if (valor < 1) {
            debiles[tipo] = (debiles[tipo] || 1) * valor;
          }
        });
      });
      this.effectivenessChange.emit({ fuertesContra: fuertes, debilContra: debiles });
    });

  }

  trackByIndex(index: number): number {
    return index;
  }
  calcularEfectividad(): void {

    // 1. Obtener todos los IDs de los tipos de los Pokémon del equipo
    const tiposIds: number[] = [];

    this.team.forEach(pokemon => {
      if (pokemon && Array.isArray(pokemon.tipos)) {
        pokemon.tipos.forEach((tipo: any) => {
          if (tipo?.id != null) {
            tiposIds.push(tipo.id);
          }
        });
      }
    });

    // 2. Hacer llamadas a la API para obtener la efectividad de cada tipo
    const peticiones = tiposIds.map(id => this.apiservice.getEfectividad(id));

    // 3. Esperar a que todas las respuestas lleguen
    forkJoin(peticiones).subscribe(respuestas => {
      const resultado: { [tipo: string]: number } = {};

      // 4. Procesar cada respuesta
      respuestas.forEach(res => {
        const eficacia = res.eficacia;

        // Sumar o restar 1 según la efectividad
        for (const tipo in eficacia) {
          const valor = eficacia[tipo];

          if (valor > 1) {
            resultado[tipo] = (resultado[tipo] || 0) + 1; // fuerte
          } else if (valor < 1) {
            resultado[tipo] = (resultado[tipo] || 0) - 1; // débil
          }
          // Si es 1, no cambia el resultado
        }
      });

      // 5. Separar en tipos fuertes y débiles
      const fuertes: { [tipo: string]: number } = {};
      const debiles: { [tipo: string]: number } = {};

      for (const tipo in resultado) {
        const valor = resultado[tipo];
        if (valor > 0) {
          fuertes[tipo] = valor;
        } else if (valor < 0) {
          debiles[tipo] = valor;
        }
      }

      // 6. Emitir los resultados al componente padre
      this.effectivenessChange.emit({
        fuertesContra: fuertes,
        debilContra: debiles
      });
    });
  }


}
