// import { Component, EventEmitter, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ApiService } from '../../../core/services/api/api.service';
// import { forkJoin, of } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Component({
//   selector: 'app-team-builder',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './team-builder.component.html',
//   styleUrl: './team-builder.component.scss'
// })
// export class TeamBuilderComponent {
//   @Output() effectivenessChange = new EventEmitter<{ strength: any, weakness: any }>();
//   team: any[] = new Array(6).fill(null);
//   filteredLists = new Array(6).fill([]);
//   dropdowns: boolean[] = new Array(6).fill(false);
//   allPokemon: any[] = [];

//   url = 'http://localhost:8000';

//   pokemonCache = new Map<number, any>();
//   efectividadCache = new Map<number, any>();

//   constructor(private api: ApiService) { }

//   clearPokemon(index: number): void {
//     this.team[index] = null;
//     this.dropdowns[index] = false;
//     this.emitEffectiveness();
//   }

//   ngOnInit(): void {
//     this.api.getAllPokemons().subscribe((data: any) => {
//       this.allPokemon = data['member'];
//     });
//   }

//   toggleDropdown(index: number): void {
//     this.dropdowns[index] = !this.dropdowns[index];

//     if (this.dropdowns[index]) {
//       const selectedIds = this.team.map(p => p?.id).filter(id => id !== null);
//       this.filteredLists[index] = this.allPokemon.filter(p =>
//         !selectedIds.includes(p.id) || this.team[index]?.id === p.id
//       );
//     }
//   }
//   closeDropdown(index: number): void {
//     this.dropdowns[index] = false;
//   }

//   getFilteredPokemonList(index: number): any[] {
//     const selectedIds = this.team.map(p => p?.id).filter(id => id !== null);
//     return this.allPokemon.filter(p => !selectedIds.includes(p.id) || this.team[index]?.id === p.id);
//   }

//   onPokemonSelected(index: number, id: number): void {
//     const cached = this.api.getCachedPokemon(id);

//     if (cached) {
//       this.team[index] = cached;
//       this.dropdowns[index] = false;
//       this.emitEffectiveness();
//     } else {
//       this.api.getPokemon(id).subscribe((pokemon: any) => {
//         this.team[index] = pokemon;
//         this.api.savePokemonToCache(id, pokemon);
//         this.dropdowns[index] = false;
//         this.emitEffectiveness();
//       });
//     }
//   }

//   emitEffectiveness(): void {
//     const tipoIds = new Set<number>();

//     this.team.forEach(pokemon => {
//       if (pokemon && pokemon.tipos) {
//         pokemon.tipos.forEach((tipo: any) => {
//           if (tipo.id) tipoIds.add(tipo.id);
//         });
//       }
//     });

//     const ids = Array.from(tipoIds);
//     if (ids.length === 0) {
//       this.effectivenessChange.emit({ strength: {}, weakness: {} });
//       return;
//     }

//     const requests = ids.map(id => this.api.getTipos(id));
//     forkJoin(requests).subscribe((tiposData: any[]) => {
//       const strengths: Record<string, number> = {};
//       const weaknesses: Record<string, number> = {};

//       tiposData.forEach(tipo => {
//         tipo.fuertesContra?.forEach((nombre: string) => {
//           strengths[nombre] = (strengths[nombre] || 1) * 2;
//         });
//         tipo.debilContra?.forEach((nombre: string) => {
//           weaknesses[nombre] = (weaknesses[nombre] || 1) * 0.5;
//         });
//       });

//       this.effectivenessChange.emit({ strength: strengths, weakness: weaknesses });
//     });
//   }

//   trackByIndex(index: number): number {
//     return index;
//   }
// }

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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAllPokemons().subscribe((data: any) => {
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

  onPokemonSelected(index: number, id: number): void {
    const cached = this.api.getCachedPokemon(id);

    if (cached) {
      this.team[index] = cached;
      this.dropdowns[index] = false;
      this.emitEffectiveness();
    } else {
      this.api.getPokemon(id).subscribe((pokemon: any) => {
        this.team[index] = pokemon;
        this.api.savePokemonToCache(id, pokemon);
        this.dropdowns[index] = false;
        this.emitEffectiveness();
      });
    }
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

    const requests = ids.map(id => this.api.getEfectividad(id));
    forkJoin(requests).subscribe((respuestas: any[]) => {
  console.log('⚠️ Respuestas API:', respuestas); // <-- Esto ya lo tienes o similar

  const fuertes: Record<string, number> = {};
  const debiles: Record<string, number> = {};

  respuestas.forEach(respuesta => {
    console.log('🌐 Respuesta individual:', respuesta);  // NUEVO

    const eficacia = respuesta.eficacia as Record<string, number>;

    if (!eficacia) {
      console.warn('❌ Sin eficacia en respuesta:', respuesta);
      return;
    }

    Object.entries(eficacia).forEach(([tipo, valor]) => {
      console.log(`✔️ ${tipo} -> ${valor}`);
      if (valor > 1) {
        fuertes[tipo] = (fuertes[tipo] || 1) * valor;
      } else if (valor < 1) {
        debiles[tipo] = (debiles[tipo] || 1) * valor;
      }
    });
  });

  console.log('💪 Fortalezas:', fuertes);
  console.log('😨 Debilidades:', debiles);

  this.effectivenessChange.emit({ fuertesContra: fuertes, debilContra: debiles });
});

  }

  trackByIndex(index: number): number {
    return index;
  }
}
