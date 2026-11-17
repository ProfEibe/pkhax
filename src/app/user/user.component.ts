import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { MessageService } from '@openng/optimus-ui/api';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageModule } from '@openng/optimus-ui/message';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  providers: [MessageService],
  imports: [ToastModule, MessageModule, ButtonModule, FormsModule, InputTextModule, CommonModule],
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  auth = inject(AuthService);

  user = signal<User | undefined>(undefined);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load user data');
        this.isLoading.set(false);
        console.error('User load error:', err);
      },
    });
  }

  updateUser(): void {
    const current = this.user();
    if (!current) {
      return;
    }
    this.userService.updateUserName(current).subscribe({
      next: (user) => {
        this.user.set(user);
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'User updated' });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message ?? 'User could not be saved',
        });
        console.error(error);
      },
    });
  }
}
