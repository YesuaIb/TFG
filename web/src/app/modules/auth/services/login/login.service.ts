import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  login(correo: string, pass: string) {
    const body = { correo, pass };
    const headers = { 'Content-Type': 'application/ld+json' };
    return this.http.post(`http://localhost:8000/api/login`, body, { headers });
  }
}