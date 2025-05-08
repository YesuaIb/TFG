import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../../auth/views/login/login.component';
import { RegisterComponent } from '../../../auth/views/register/register.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  modalLoginOpen = false;
  modalRegisterOpen = false;

  openLoginModal() {
    this.modalLoginOpen = true;
    this.modalRegisterOpen = false;
  }

  closeLoginModal() {
    this.modalLoginOpen = false;
  }

  openRegisterModal() {
    this.modalRegisterOpen = true;
    this.modalLoginOpen = false;
  }

  closeRegisterModal() {
    this.modalRegisterOpen = false;
  }
}
