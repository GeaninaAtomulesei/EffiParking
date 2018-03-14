import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import {UserService} from "../services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private userService: UserService) {}

    canActivate() {
      if (localStorage.getItem('isLoggedIn')) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
}
