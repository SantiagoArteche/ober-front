import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.modal.html',
})
export class ErrorModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';

  onClose() {
    const modalElement = document.querySelector('app-error-modal');
    if (modalElement) {
      modalElement.remove();
    }
  }
}
