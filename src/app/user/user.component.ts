import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../user';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})
export class UserComponent implements OnInit {
  user: User;

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => this.user = user);
  }

  updateUser(): void {
    this.userService.updateUserName(this.user).subscribe(user => {
      this.user = user;
      this.messageService.add({severity: 'success', summary: 'Saved', detail: 'User updated'});
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
      console.log(error);
    });
  }
}
