import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
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
    this.hide();

    const modalComponentRef = createComponent(ErrorModalComponent, {
      environmentInjector: this.injector,
    });

    modalComponentRef.instance.title = title;
    modalComponentRef.instance.message = message;

    document.body.appendChild(modalComponentRef.location.nativeElement);

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
