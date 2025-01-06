import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-view',
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './task-view.component.html',
})
export class TaskViewComponent implements OnInit {
  taskId: string | null = null;
  task: Task | null = null;
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
    });
    this.loadTask();
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe(
        (task: any) => {
          this.task = task.task;
        },
        (error) => {
          console.error('Error al cargar la tarea:', error);
        }
      );
    }
  }
}
