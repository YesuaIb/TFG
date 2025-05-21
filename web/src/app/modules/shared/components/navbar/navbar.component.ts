import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../../auth/views/login/login.component';
import { RegisterComponent } from '../../../auth/views/register/register.component';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  constructor(private modalLoginService: ModalLoginService, private router: Router) { }

  modalLoginOpen = false;
  modalRegisterOpen = false;
  nombreUsuario: string | null = null;

  ngOnInit(): void {
    this.modalLoginService.loginModal$.subscribe((show) => {
      this.modalLoginOpen = show;
    });

    this.nombreUsuario = localStorage.getItem('username.nombre');

    this.modalLoginService.username$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
  }

  openLoginModal() {
    this.modalLoginService.openLoginModal();
    this.modalRegisterOpen = false;
  }

  closeLoginModal() {
    this.modalLoginService.closeLoginModal();
  }

  openRegisterModal() {
    this.modalRegisterOpen = true;
    this.modalLoginOpen = false;
  }

  closeRegisterModal() {
    this.modalRegisterOpen = false;
  }

  handleLoginSuccess(nombre: string) {
    this.nombreUsuario = nombre;
    this.closeLoginModal();
  }

  handleRegisterSuccess() {
    this.closeRegisterModal();
  }

  logout() {
    this.modalLoginService.logout();
    this.nombreUsuario = null;
    this.router.navigate(['/']);
  }

}
