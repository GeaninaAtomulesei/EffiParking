import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessDeniedRoutingModule } from './access-denied-routing.module';
import { AccessDeniedComponent } from './access-denied.component';
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../app.module";
import {UserService} from "../shared/services/user.service";

@NgModule({
  imports: [
    CommonModule,
    AccessDeniedRoutingModule
  ],
  declarations: [AccessDeniedComponent],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ]
})
export class AccessDeniedModule { }
