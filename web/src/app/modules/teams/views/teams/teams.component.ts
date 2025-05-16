// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
// import { TeamMatchupComponent } from '../../components/team-matchup/team-matchup.component';
// import { LoginComponent } from '../../../auth/views/login/login.component';
// import { ApiService } from '../../../core/services/api/api.service';
// import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';

// @Component({
//   selector: 'app-teams',
//   standalone: true,
//   imports: [CommonModule, TeamBuilderComponent, TeamMatchupComponent, LoginComponent],
//   templateUrl: './teams.component.html',
//   styleUrl: './teams.component.scss'
// })
// export class TeamsComponent {
//   fuertesContra = {};
//   debilContra = {};

//   mostrarModalEquipos = false;
//   mostrarModalLogin = false;
//   equiposUsuario: any[] = [];

//   constructor(private api: ApiService, private modalLoginService: ModalLoginService) {
//     this.modalLoginService.loginModal$.subscribe(() => {
//       this.mostrarModalLogin = true;
//     });
//   }

//   updateEffectiveness(effectiveness: { strength: any, weakness: any }) {
//     this.fuertesContra = effectiveness.strength;
//     this.debilContra = effectiveness.weakness;
//   }

//   abrirModalEquipos(): void {
//     const user = localStorage.getItem('user');

//     if (!user) {
//       this.modalLoginService.openLoginModal();
//       return;
//     }

//     const userId = JSON.parse(user).id;

//     this.api.getEquipos().subscribe((equipos) => {
//       this.equiposUsuario = equipos['hydra:member'].filter((equipo: any) => {
//         return equipo.usuario?.id === userId;
//       });

//       this.mostrarModalEquipos = true;
//     });
//   }

//   cerrarModalEquipos(): void {
//     this.mostrarModalEquipos = false;
//   }

//   cerrarModalLogin(): void {
//     this.mostrarModalLogin = false;
//   }

//   onLoginSuccess(): void {
//     this.mostrarModalLogin = false;
//     this.abrirModalEquipos();
//   }

//   guardarEquipo(): void {
//     const user = localStorage.getItem('user');

//     if (!user) {
//       this.modalLoginService.openLoginModal();
//       return;
//     }
//   }
// }



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { TeamMatchupComponent } from '../../components/team-matchup/team-matchup.component';
import { LoginComponent } from '../../../auth/views/login/login.component';
import { ApiService } from '../../../core/services/api/api.service';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, TeamBuilderComponent, TeamMatchupComponent, LoginComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  fuertesContra: Record<string, number> = {};
  debilContra: Record<string, number> = {};

  mostrarModalEquipos = false;
  mostrarModalLogin = false;
  equiposUsuario: any[] = [];

  constructor(private api: ApiService, private modalLoginService: ModalLoginService) {
    this.modalLoginService.loginModal$.subscribe(() => {
      this.mostrarModalLogin = true;
    });
  }

  actualizarEfectividad(data: { fuertesContra: any, debilContra: any }) {
  this.fuertesContra = { ...data.fuertesContra };
  this.debilContra = { ...data.debilContra };
  console.log('Actualizado efectividad:', this.fuertesContra, this.debilContra);
}


  abrirModalEquipos(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.modalLoginService.openLoginModal();
      return;
    }
    const userId = JSON.parse(user).id;
    this.api.getEquipos().subscribe((equipos) => {
      this.equiposUsuario = equipos['hydra:member'].filter((equipo: any) => equipo.usuario?.id === userId);
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

  guardarEquipo(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.modalLoginService.openLoginModal();
    }
  }
}