import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';

import {ApiResponseData} from './apiResponseData';
import {AuthService} from './auth.service';
import {UserModel} from './model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {


  isLoginMode = true;
  isLoading = false;
  error: string;
  user: UserModel;


  constructor(private authService: AuthService,
              private router: Router) {
    this.user = new UserModel();
  }


  onSwichMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formValue: NgForm) {
    if (formValue.invalid) {
      return;
    }
    // let authObs: Observable<ApiResponseData>;
    let authObs: Observable<ApiResponseData>;


    this.isLoading = true;
    const email = formValue.value.email;
    const password = formValue.value.password;

    if (!this.isLoginMode) {
      authObs = this.authService.singUp(email, password);
    } else {
      authObs = this.authService.logIn(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    // console.log(formValue.value);
    formValue.reset();

  }


}
