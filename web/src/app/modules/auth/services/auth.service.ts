import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post('/api/usuarios', usuario);
  }
}
