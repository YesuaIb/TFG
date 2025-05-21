import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { LoginService } from '../../services/login/login.service';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();
  submitted = false;
  registerForm: FormGroup;
  cantidadEquipos: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: UsuariosService,
    private router: Router,
    private modalLoginService: ModalLoginService,
    private loginService: LoginService,
    private apiservice: ApiService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ\\s]{2,}$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const usuario = {
      nombre: this.registerForm.value.name,
      correo: email,
      pass: password
    };

    this.authService.crearUsuario(usuario).subscribe({
      next: () => {
        this.loginService.login(email, password).subscribe({
          next: (res: any) => {
            const nombre = res?.nombre ?? usuario.nombre;
            localStorage.setItem('username', JSON.stringify(res));
            this.apiservice.getAllEquiposByUser(res.id).subscribe((equipos) => {
              console.log(equipos['member'].length);
              this.cantidadEquipos = equipos['member'].length;
              localStorage.setItem('equipos', this.cantidadEquipos.toString());
            });
            this.modalLoginService.setUsername(nombre);
            this.registerSuccess.emit();
          },
          error: (err) => {
            console.error('Login automático fallido:', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Error al registrar:', err);
      }
    });
  }
}
