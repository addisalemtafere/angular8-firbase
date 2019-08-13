import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

import {ApiResponseData} from './apiResponseData';
import {AuthService} from './auth.service';
import {UserModel} from './model/user.model';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;


  isLoading = false;
  error: string;
  user: UserModel;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(private authService: AuthService,
              private componentFactoryResolver: ComponentFactoryResolver,
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
        this.showError(errorMessage);
        this.isLoading = false;
      }
    );
    // console.log(formValue.value);
    formValue.reset();

  }

  onErrorHandler() {
    this.error = null;
  }


  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showError(message: string) {

    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;

    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }
}
