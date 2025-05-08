import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() switchToLogin = new EventEmitter<void>();

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-ZÀ-ÿ\\s]{2,}$")
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$')
      ]]
    });
  }

  submitted = false;

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.valid) {
      console.log('Datos de registro:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
