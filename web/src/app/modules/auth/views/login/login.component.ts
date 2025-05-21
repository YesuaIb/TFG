import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorLogin = false;
  cantidadEquipos = 0;

  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();


  constructor(private fb: FormBuilder, private loginservice: LoginService, private router: Router, private modalLoginService: ModalLoginService, private apiservice: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorLogin = false;

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.loginservice.login(email, password).subscribe({
      next: (res: any) => {
        console.log(res.id);
        const nombre = res?.nombre ?? '';
        localStorage.setItem('username', JSON.stringify(res));
        this.apiservice.getAllEquiposByUser(res.id).subscribe((equipos) => {
          console.log(equipos['member'].length);
          this.cantidadEquipos = equipos['member'].length;
          localStorage.setItem('equipos', this.cantidadEquipos.toString());
        });
        this.modalLoginService.setUsername(nombre);
        this.loginSuccess.emit(nombre);
      },
      error: () => {
        this.errorLogin = true;
      }
    });
  }

}
