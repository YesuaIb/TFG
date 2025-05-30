import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalLoginService {
  // Control de visibilidad
  private loginModalSubject = new BehaviorSubject<boolean>(false);
  loginModal$ = this.loginModalSubject.asObservable();

  // Control del nombre del usuario logueado
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  username$ = this.usernameSubject.asObservable();

  // Abrir y cerrar 
  openLoginModal() {
    this.loginModalSubject.next(true);
  }

  closeLoginModal() {
    this.loginModalSubject.next(false);
  }

  // Actualizar nombre de usuario
  setUsername(nombre: string) {
    this.usernameSubject.next(nombre);
  }

  // Cerrar sesión
  logout() {
    this.usernameSubject.next(null);
    localStorage.removeItem('username');
    localStorage.removeItem('equipos');
  }
}
