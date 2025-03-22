import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  type OnInit,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ClickOutsideDirective } from './click-outside.directive';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface User {
  id: string;
  _id?: string | undefined;
  name: string;
  email: string;
}

@Component({
  selector: 'app-multi-select-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './multi-select-users.component.html',
})
export class MultiSelectUsersComponent implements OnInit, OnChanges {
  @Input() selectedUsers: any[] = [];
  @Output() selectedUsersChange = new EventEmitter<any[]>();
  @Input() projectUsers: any[] = [];
  @Input() filterByProject = false;

  private authService = inject(AuthService);
  private searchSubject = new Subject<string>();

  isOpen = false;
  searchTerm = '';
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  userMap: Map<string, User> = new Map();
  availableUsers: User[] = [];

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterUsers(term);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectUsers'] || changes['filterByProject']) {
      this.updateAvailableUsers();
      this.filterUsers(this.searchTerm);
    }
  }

  updateAvailableUsers(): void {
    if (
      this.filterByProject &&
      this.projectUsers &&
      this.projectUsers.length > 0
    ) {
      const projectUserIds = new Set<string>();

      this.projectUsers.forEach((user) => {
        const userId = typeof user === 'string' ? user : user.id || user._id;
        if (userId) {
          projectUserIds.add(userId);
        }
      });

      this.availableUsers = this.allUsers.filter((user) => {
        const userId = user.id || user._id;
        return userId && projectUserIds.has(userId);
      });
    } else {
      this.availableUsers = [];
    }
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;

        this.userMap.clear();
        users.forEach((user) => {
          const id = user.id || user._id;
          if (id) {
            this.userMap.set(id, user);
          }
        });

        this.updateAvailableUsers();
        this.filterUsers(this.searchTerm);
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterUsers(this.searchTerm);
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  filterUsers(term: string): void {
    if (!this.availableUsers) return;

    if (!term.trim()) {
      this.filteredUsers = this.availableUsers.filter(
        (user) => !this.isSelected(user.id || user._id)
      );
    } else {
      this.filteredUsers = this.availableUsers.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase());
        return matchesSearch && !this.isSelected(user.id || user._id);
      });
    }
  }

  isSelected(userId: string | undefined): boolean {
    if (!userId) return false;

    return this.selectedUsers.some((user) => {
      if (typeof user === 'string') {
        return user === userId;
      }
      return user.id === userId || user._id === userId;
    });
  }

  toggleUser(userId?: string): void {
    if (!userId) return;

    if (this.isSelected(userId)) {
      this.removeUser(userId);
    } else {
      this.addUser(userId);
    }
  }

  addUser(userId: string): void {
    if (this.isSelected(userId)) return;

    const user = this.userMap.get(userId);
    if (user) {
      const updatedUsers = [...this.selectedUsers, user];
      this.selectedUsers = updatedUsers;
      this.selectedUsersChange.emit(updatedUsers);
      this.filterUsers(this.searchTerm);
    }
  }

  removeUser(userId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const updatedUsers = this.selectedUsers.filter((user) => {
      if (typeof user === 'string') {
        return user !== userId;
      }
      return user.id !== userId && user._id !== userId;
    });

    this.selectedUsers = updatedUsers;
    this.selectedUsersChange.emit(updatedUsers);
    this.filterUsers(this.searchTerm);
  }

  getUserName(userId: string | any): string {
    if (!userId) return '';

    if (typeof userId !== 'string') {
      return userId.name || 'Usuario';
    }

    const user = this.userMap.get(userId);
    return user ? user.name : 'Usuario';
  }
}
