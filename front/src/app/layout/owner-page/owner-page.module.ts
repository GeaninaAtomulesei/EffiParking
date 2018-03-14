import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwnerPageComponent} from "./owner-page.component";
import {OwnerPageRoutingModule} from "./owner-page-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import {ParkingPageModule} from "../parking-page/parking-page.module";
import {UserService} from "../../shared/services/user.service";
import {initUserFactory} from "../../app.module";
import {APP_INITIALIZER} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    OwnerPageRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ParkingPageModule
  ],
  declarations: [OwnerPageComponent],
  providers: [
    ParkingService,
    UserService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
    ]
})
export class OwnerPageModule {}
