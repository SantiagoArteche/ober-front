import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        'x-auth': token,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
