import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { MessageService } from '@openng/optimus-ui/api';
import { ToastModule } from '@openng/optimus-ui/toast';
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService],
  imports: [ToastModule, CardModule, ButtonModule, FormsModule, InputTextModule, CommonModule],
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  auth = inject(AuthService);

  user: User | undefined;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
        console.error('User load error:', err);
      },
    });
  }

  updateUser(): void {
    if (!this.user) {
      return;
    }
    this.userService.updateUserName(this.user).subscribe({
      next: (user) => {
        this.user = user;
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
