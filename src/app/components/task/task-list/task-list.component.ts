import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DragDropModule,
    MatMenuModule,
  ],
  templateUrl: './task-list.component.html',
  styles: [
    `
      .task-board {
        display: flex;
        justify-content: space-around;
      }
      .task-list {
        width: 30%;
        min-height: 60px;
        background: white;
        border-radius: 4px;
        overflow: hidden;
      }
      .task-box {
        padding: 20px 10px;
        border-bottom: solid 1px;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        cursor: move;
        background: white;
        font-size: 14px;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: any) => {
        this.todo = tasks.tasks.filter(
          (task: Task) => task.status === 'pending'
        );
        this.inProgress = tasks.tasks.filter(
          (task: Task) => task.status === 'in progress'
        );
        this.done = tasks.tasks.filter(
          (task: Task) => task.status === 'completed'
        );
      },
      (error) => {
        console.error('Error loading tasks', error);
      }
    );
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = this.getStatusFromList(event.container.id);
      this.taskService.updateTaskStatus(task._id, task.status).subscribe(
        () => {
          console.log('Task status updated successfully');
        },
        (error) => {
          console.log(error);
          console.error('Error updating task status', error);
        }
      );
    }
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.taskService.deleteTask(id).subscribe(
        () => {
          this.loadTasks();
        },
        (error) => {
          console.error('Error deleting project', error);
        }
      );
    }
  }

  getStatusFromList(listId: string): string {
    switch (listId) {
      case 'pending':
        return 'pending';
      case 'in progress':
        return 'in progress';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  }
}
