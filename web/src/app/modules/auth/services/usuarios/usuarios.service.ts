import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private http: HttpClient) { }

  crearUsuario(usuario: any) {
    const headers = { 'Content-Type': 'application/ld+json' };
    return this.http.post('http://localhost:8000/api/usuarios', usuario, { headers });
  }
}
