import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorModalService } from '../services/error-modal.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorModalService = inject(ErrorModalService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorTitle = 'Error';
      let errorMessage = 'Ha ocurrido un error.';

      console.log(error);
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorTitle = `Error ${error.status}`;

        if (error.error && typeof error.error === 'object') {
          errorMessage +=
            '\n\nDetalles:\n' + JSON.stringify(error.error, null, 2);
        }
      }

      errorModalService.show(errorTitle, errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
