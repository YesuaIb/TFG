import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss']
})
export class TeamBuilderComponent implements OnInit {
  @Output() effectivenessChange = new EventEmitter<{ strength: any, weakness: any }>();

  team: any[] = Array(6).fill(null);
  pokemonList: any[] = [];
  dropdownOpen: boolean[] = Array(6).fill(false);
  effectiveness: { strength: Record<string, number>, weakness: Record<string, number> } = {
    strength: {},
    weakness: {}
  };

  constructor(private api: ApiService) {}

  allTypes: string[] = [];

  ngOnInit(): void {
    this.api.getAllTypes().subscribe(types => {
      this.allTypes = types.map((t: any) => t.name);

      const emptyStrengths: Record<string, number> = {};
      const emptyWeaknesses: Record<string, number> = {};
  
      this.allTypes.forEach(type => {
        emptyStrengths[type] = 0;
        emptyWeaknesses[type] = 0;
      });
  
      this.effectiveness = { strength: emptyStrengths, weakness: emptyWeaknesses };
      this.effectivenessChange.emit(this.effectiveness);
    });
  
    for (let i = 1; i <= 15; i++) {
      this.api.getPokemonWithTypes(i.toString()).subscribe(p => {
        this.pokemonList.push(p);
      });
    }
  }
  
  toggleDropdown(index: number): void {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }

  onPokemonSelected(index: number, name: string): void {
    this.api.getPokemonWithTypes(name).subscribe(pokemon => {
      this.team[index] = pokemon;
      this.dropdownOpen[index] = false;

      if (this.allTypes.length > 0) {
        this.calculateEffectiveness();
      } else {
        this.api.getAllTypes().subscribe(types => {
          this.allTypes = types.map((t: any) => t.name);
          this.calculateEffectiveness();
        });
      }
    });
  }
  
  
  calculateEffectiveness(): void {
    const strengths: Record<string, number> = {};
    const weaknesses: Record<string, number> = {};
  
    this.allTypes.forEach(type => {
      strengths[type] = 0;
      weaknesses[type] = 0;
    });
  
    this.team.forEach(pokemon => {
      if (!pokemon) return;
  
      pokemon.types.forEach((typeData: any) => {
        const relations = typeData.typeDetails.damage_relations;
  
        relations.double_damage_to.forEach((t: any) => {
          strengths[t.name]++;
        });
  
        relations.double_damage_from.forEach((t: any) => {
          weaknesses[t.name]++;
        });
      });
    });
  
    this.effectiveness = { strength: strengths, weakness: weaknesses };
    this.effectivenessChange.emit(this.effectiveness);
  }  
}  
