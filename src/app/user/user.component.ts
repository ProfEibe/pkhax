import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
  user: User | undefined;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public auth: AuthService
  ) { }

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
      }
    });
  }

  updateUser(): void {
    if (!this.user) {
      return;
    }
    this.userService.updateUserName(this.user).subscribe(
      (user) => {
        this.user = user;
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'User updated',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
        console.log(error);
      },
    );
  }
}
