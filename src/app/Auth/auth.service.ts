import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponseData } from './apiResponseData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  singUp(email: string, password: string) {
    return this.http.post<ApiResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBYHCwGzzwXWj0RIM9uthIX7eHXPYxfwQg',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }),
      pipe(catchError(errRes => {
        let errorMessage = 'unknow error ecuured';

        if (!errRes.error || !errRes.error.error) {
          throwError(errorMessage)
        }
        switch (errRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This Email Exists';
            console.log(errorMessage);
            break;

        }
        return throwError(errorMessage);
      }));


  }


  logIn(email: string, password: string) {
    return this.http.post<ApiResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBYHCwGzzwXWj0RIM9uthIX7eHXPYxfwQg,
    {
          email: email,
          password: password,
          returnSecureToken: true
        })
      .subscribe()
      .pipe();
  }
}
