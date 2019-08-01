import { error } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { ApiResponseData } from './apiResponseData';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;
  isLoading = false;
  error: string;


  constructor(private authService: AuthService) { }

  onSwichMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formValue: NgForm) {
    if (formValue.invalid) {
      return;
    }
    let authObs: Observable<ApiResponseData>;
    this.isLoading = true;
    const email = formValue.value.email;
    const password = formValue.value.password;

    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password);

    } else {
      authObs = this.authService.singUp(email, password);
    }

    authObs.subscribe(
      succesRes => {
        console.log(succesRes);
        this.isLoading = false;
      }
      , errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      });

    console.log(formValue.value);
    formValue.reset();

  }
}
