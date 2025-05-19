import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { ModalLoginService } from '../../../core/services/modal-login/modal-login.service';

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

  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();


  constructor(private fb: FormBuilder, private loginservice: LoginService, private router: Router, private modalLoginService: ModalLoginService) {
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
        const nombre = res?.nombre ?? '';
        localStorage.setItem('username', nombre); 
        this.modalLoginService.setUsername(nombre); 
        this.loginSuccess.emit(nombre); 
      },
      error: () => {
        this.errorLogin = true;
      }
    });
  }

}
