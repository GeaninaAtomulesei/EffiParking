import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {UserService} from "../shared/services/user.service";
import {LoginRoutingModule} from "./login-routing.module";

@NgModule({
    imports: [
      CommonModule,
      LoginRoutingModule,
      FormsModule,
      ReactiveFormsModule
    ],
    declarations: [LoginComponent],
    providers : [
      UserService,
      AuthService
    ]
})
export class LoginModule {}
