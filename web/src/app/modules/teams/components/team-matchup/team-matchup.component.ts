import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-team-matchup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-matchup.component.html',
  styleUrl: './team-matchup.component.scss',
})
export class TeamMatchupComponent implements OnChanges {
  @Input() fuertesContra: Record<string, number> = {};
  @Input() debilContra: Record<string, number> = {};
  @Input() tipos: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    if (this.tipos.length === 0) {
      const cached = this.apiService.getCachedTipos();
      if (cached.length > 0) {
        this.tipos = cached;
      } else {
        this.apiService.getAllTipos().subscribe((data) => {
          this.tipos = data['member'];
          this.apiService.saveTiposToCache(this.tipos);
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tipos.length === 0) {
      const cached = this.apiService.getCachedTipos();
      if (cached.length > 0) {
        this.tipos = cached;
      } else {
        this.apiService.getAllTipos().subscribe((data) => {
          this.tipos = data['member'];
          this.apiService.saveTiposToCache(this.tipos);
        });
      }
    }
  }

  getTipoConEficacia(nombre: string): { nombre: string; icono: string; valor: number } {
    const tipo = this.tipos.find(t => t.nombre === nombre);
    const valor = this.fuertesContra[nombre] ?? this.debilContra[nombre] ?? 1;
    return { nombre, icono: tipo?.icono ?? '', valor };
  }

  getTypeList(obj: Record<string, number>): { nombre: string, valor: number }[] {
    return Object.entries(obj).map(([nombre, valor]) => ({ nombre, valor }));
  }

  getMultiplicador(nombre: string): number {
    const fuerte = this.fuertesContra?.[nombre];
    const debil = this.debilContra?.[nombre];

    const valor = fuerte ?? debil ?? 0;

    return valor;
  }

  hasFortalezas(): boolean {
    return this.tipos.some(t => this.getMultiplicador(t.nombre) > 0);
  }

  hasDebilidades(): boolean {
    return this.tipos.some(t => this.getMultiplicador(t.nombre) < 0);
  }

  getFortaleza(nombre: string): number {
    return this.fuertesContra?.[nombre] ?? 0;
  }

  getDebilidad(nombre: string): number {
    return this.debilContra?.[nombre] ?? 0;
  }

  formatearValor(valor: number): string {
    if (valor > 0) {
      return '+' + valor;
    } else if (valor < 0) {
      return valor.toString();
    } else {
      return '0';
    }
  }
}
