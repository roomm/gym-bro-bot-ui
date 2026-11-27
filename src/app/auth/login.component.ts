import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import {LanguageService} from '../services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./login.component.html`,
})
export class LoginComponent implements OnInit {
  auth = inject(AuthService);
  i18n = inject(LanguageService);
  fb = inject(FormBuilder);
  router = inject(Router);

  loading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const { email, password } = this.loginForm.getRawValue();
      this.auth.login(email, password).subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false)
      });
    }
  }

}
