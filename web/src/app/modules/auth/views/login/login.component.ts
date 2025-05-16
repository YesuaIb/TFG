import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')
      ]]
    });
  }

  submitted = false;

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.api.getLogin(credentials).subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Usuario logueado:', user);
          this.loginSuccess.emit();
        },
        error: (err) => {
          console.error('Error de login:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
