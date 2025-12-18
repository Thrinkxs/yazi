import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email() || !this.password()) {
      this.error.set('Please enter both email and password');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const response = await this.authService.login({
        email: this.email(),
        password: this.password()
      });

      console.log('Login successful:', response);
      
      // Show success toast
      toast.success('Login successful!');
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
      
    } catch (error: any) {
      this.error.set(error.message);
      toast.error(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }
}
