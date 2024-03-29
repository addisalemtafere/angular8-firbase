import {Component, OnInit} from '@angular/core';
import {AuthService} from './Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private auhService: AuthService) {

  }

  ngOnInit(): void {
    this.auhService.autoLogin();
  }

}
