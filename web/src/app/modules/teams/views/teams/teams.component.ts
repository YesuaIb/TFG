import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { TeamMatchupComponent } from '../../components/team-matchup/team-matchup.component';
import { LoginComponent } from '../../../auth/views/login/login.component';
import { ApiService } from '../../../core/services/api/api.service';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamBuilderComponent, TeamMatchupComponent, LoginComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

  fuertesContra: Record<string, number> = {};
  debilContra: Record<string, number> = {};
  tipos: any[] = [];
  mostrarModalEquipos = false;
  mostrarModalLogin = false;
  mostrarModalGuardarEquipo = false;
  nombreEquipo: string = '';
  equiposUsuario: any[] = [];
  equipoActual: number[] = [];


  constructor(private apiservice: ApiService, private modalLoginService: ModalLoginService) {
    this.modalLoginService.loginModal$.subscribe(() => {
      this.mostrarModalLogin = true;
    });
  }

  ngOnInit(): void {
    this.tipos = this.apiservice.getCachedTipos();
  }

  actualizarEfectividad(data: { fuertesContra: any, debilContra: any }) {
    this.fuertesContra = data.fuertesContra;
    this.debilContra = data.debilContra;
  }

  abrirModalEquipos(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.modalLoginService.openLoginModal();
      return;
    }
    const userId = JSON.parse(user).id;
    const allPokemons = this.apiservice.getCachedAllPokemons();

    this.apiservice.getEquipos().subscribe((equipos) => {
      const equiposFiltrados = equipos['hydra:member']
        .filter((equipo: any) => equipo.usuario?.id === userId)
        .map((equipo: any) => {
          return {
            nombreEquipo: equipo.nombreEquipo,
            pokemons: equipo.pokemons.map((id: number) => {
              const encontrado = allPokemons.find((p: any) => p.id === id);
              return encontrado ? encontrado.nombre : `ID ${id}`;
            })
          };
        });

      this.equiposUsuario = equiposFiltrados;
      this.mostrarModalEquipos = true;
    });
  }

  cerrarModalEquipos(): void {
    this.mostrarModalEquipos = false;
  }

  cerrarModalLogin(): void {
    this.mostrarModalLogin = false;
  }

  onLoginSuccess(): void {
    this.mostrarModalLogin = false;
    this.abrirModalEquipos();
  }

  actualizarEquipo(pokemons: number[]) {
    this.equipoActual = pokemons;
  }

  guardarEquipo(): void {
    let user: any = localStorage.getItem('username');
    user = JSON.parse(user);
    console.log(user);
    if (!user) {
      this.modalLoginService.openLoginModal();
    } else {
      this.mostrarModalGuardarEquipo = true;

    }
  }

  cerrarModalGuardarEquipo(): void {
    this.mostrarModalGuardarEquipo = false;
  }

  submitGuardarEquipo(): void {
    if (!this.nombreEquipo.trim()) return;
    // this.apiservice.postTeam({'nombre': 'test hacer dinámico', 'numero': 1, 'usuario': user.id, 'pokemons': this.equipoActual}).subscribe((resp:any) => {
    // })
    let user: any = localStorage.getItem('username');
    const equiposStr = localStorage.getItem('equipos');
    let cantidadEquipos: number = equiposStr ? parseInt(equiposStr) : 0;
    user = JSON.parse(user);


    const nuevoEquipo = {
      nombre: this.nombreEquipo,
      numero: cantidadEquipos,
      usuario: user.id,
      pokemons: this.equipoActual,
    };

    this.apiservice.postTeam(nuevoEquipo).subscribe(() => {
      this.nombreEquipo = '';
      this.mostrarModalGuardarEquipo = false;
      cantidadEquipos++;
      localStorage.setItem('equipos', cantidadEquipos.toString());
    });
  }
}