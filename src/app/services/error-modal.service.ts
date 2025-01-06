import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  Type,
} from '@angular/core';
import { ErrorModalComponent } from '../components/error/error.modal';

@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private modalComponentRef: ComponentRef<ErrorModalComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(title: string, message: string) {
    // Remove any existing modal
    this.hide();

    // Create the modal component
    const modalComponentRef = createComponent(ErrorModalComponent, {
      environmentInjector: this.injector,
    });

    // Set the input properties
    modalComponentRef.instance.title = title;
    modalComponentRef.instance.message = message;

    // Add to the DOM
    document.body.appendChild(modalComponentRef.location.nativeElement);

    // Attach to the application change detector
    this.appRef.attachView(modalComponentRef.hostView);

    this.modalComponentRef = modalComponentRef;
  }

  hide() {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}
