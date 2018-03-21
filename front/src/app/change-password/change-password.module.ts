import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {UserService} from "../shared/services/user.service";
import {ChangePasswordComponent} from "./change-password.component";
import {ChangePasswordRoutingModule} from "./change-password-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [ChangePasswordComponent],
  providers : [
    UserService,
    AuthService
  ]
})
export class ChangePasswordModule {}
