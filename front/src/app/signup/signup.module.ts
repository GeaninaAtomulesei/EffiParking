import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './signup.component';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";
import {SignupRoutingModule} from "./signup-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [SignUpComponent],
  providers: [
    UserService,
    AuthService
  ]
})
export class SignupModule { }
