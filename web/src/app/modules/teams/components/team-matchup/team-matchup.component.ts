// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../../../core/services/api/api.service';

// @Component({
//   selector: 'app-team-matchup',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './team-matchup.component.html',
//   styleUrl: './team-matchup.component.scss',
// })
// export class TeamMatchupComponent {
//   @Input() fuertesContra: Record<string, number> = {};
//   @Input() debilContra: Record<string, number> = {};
//   tipos: any;

//   constructor(private apiService: ApiService) { }
//   alltypes: any[] = [];
//   ngOnInit(): void {
//     this.loadTiposChain();
//   }

//   loadTiposChain() {
//     const cached = this.apiService.getCachedTipos();
//     if (cached.length > 0) {
//       this.tipos = cached;
//       console.log('Tipos:', this.tipos);
//     } else {
//       this.apiService.getAllTipos().subscribe((data) => {
//         this.tipos = data['member'];
//         console.log('Tipos:', this.tipos);
//         this.apiService.saveTiposToCache(this.tipos);
//       });
//     }
//   }

//   getTipoData(nombre: string): any {
//     return this.tipos?.find((t: any) => t.nombre === nombre);
//   }

//   getTypeList(obj: Record<string, number>): { nombre: string; valor: number }[] {
//   return Object.keys(obj).map((nombre: string) => ({
//     nombre,
//     valor: obj[nombre]
//   }));
// }

// }

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

  tipos: any[] = [];

  constructor(private apiService: ApiService) {}

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

  getTypeList(obj: Record<string, number>): { nombre: string, valor: number }[] {
    return Object.entries(obj).map(([nombre, valor]) => ({ nombre, valor }));
  }
}
