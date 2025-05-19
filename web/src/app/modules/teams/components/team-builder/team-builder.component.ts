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
      console.log("pokemon",this.team[index]);
      
      this.dropdowns[index] = false;
      this.emitEffectiveness();
    });
  }

  emitEffectiveness(): void {
    const tipoIds = new Set<number>();

    this.team.forEach(pokemon => {
      if (pokemon?.tipos) {
        pokemon.tipos.forEach((tipo: any) => {
          if (tipo.id != null) {
            tipoIds.add(tipo.id);
          }
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
      const acumulado: Record<string, number> = {};

      respuestas.forEach(respuesta => {
        const eficacia = respuesta.eficacia as Record<string, number>;

        Object.entries(eficacia).forEach(([tipo, valor]) => {
          if (valor === 2) {
            acumulado[tipo] = (acumulado[tipo] ?? 0) + 1;
          } else if (valor === 0.5 || valor === 0) {
            acumulado[tipo] = (acumulado[tipo] ?? 0) - 1;
          }
          // valor 1 => no modifica nada
        });
      });

      const fuertes: Record<string, number> = {};
      const debiles: Record<string, number> = {};

      for (const tipo in acumulado) {
        const valor = acumulado[tipo];
        if (valor > 0) fuertes[tipo] = valor;
        else if (valor < 0) debiles[tipo] = valor;
        // si es 0 no se añade a ninguno
      }

      this.effectivenessChange.emit({ fuertesContra: fuertes, debilContra: debiles });
    });
  }


  trackByIndex(index: number): number {
    return index;
  }
}
