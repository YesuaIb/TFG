import { Component, ViewChild } from '@angular/core';
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
  @ViewChild('teamBuilder') teamBuilder!: TeamBuilderComponent;
  url = 'http://localhost:8000';
  fuertesContra: Record<string, number> = {};
  debilContra: Record<string, number> = {};
  tipos: any[] = [];
  mostrarModalEquipos = false;
  mostrarModalLogin = false;
  mostrarModalGuardarEquipo = false;
  nombreEquipo: string = '';
  equiposGuardados: any[] = [];
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
    const user = localStorage.getItem('username');

    if (!user) {
      this.modalLoginService.openLoginModal();
      return;
    }
    this.equiposGuardados = []; // limpiamos el modal

    const userId = JSON.parse(user).id;
    const allPokemons = this.apiservice.getCachedAllPokemons();

    this.apiservice.getAllEquiposByUser(userId).subscribe((equipos) => {
      const equiposFiltrados = equipos['member'];
      equiposFiltrados.forEach((equipo: any) => {
        console.log(equipo);
        this.equiposGuardados.push({
          nombre: equipo.nombre,
          pokemons: equipo.pokemons.map((pokemon: any) => ({
            id: pokemon.id,
            imagen: pokemon.imagen
          }))
        });
      });
      console.log(this.equiposGuardados);
      this.mostrarModalEquipos = true;
    });
  }

  cerrarModalEquipos(): void {
    this.equiposGuardados = [];
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

  cargarEquipo(equipo: any): void {
    const equipoCompleto = equipo.pokemons.map((p: any) => ({ id: p.id }));

    this.equipoActual = equipoCompleto;
    console.log('equipo cargado', this.equipoActual);

    this.teamBuilder.cargarDesdePadre(equipoCompleto);

    this.mostrarModalEquipos = false;
  }
}