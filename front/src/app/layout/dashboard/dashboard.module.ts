import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbCarouselModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardComponent} from './dashboard.component';
import {
  TimelineComponent,
  NotificationComponent,
  ChatComponent
} from './components';
import {StatModule} from '../../shared';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {ParkingService} from "../../shared/services/parking.service";
import {ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ParkingPageModule} from "../parking-page/parking-page.module";
import {initUserFactory} from "../../app.module";
import {APP_INITIALIZER} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";

@NgModule({
  imports: [
    CommonModule,
    NgbCarouselModule.forRoot(),
    NgbAlertModule.forRoot(),
    DashboardRoutingModule,
    StatModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ParkingPageModule
  ],
  declarations: [
    DashboardComponent,
    TimelineComponent,
    NotificationComponent,
    ChatComponent
  ],
  providers: [
    ParkingService,
    UserService,
    AuthService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ]
})
export class DashboardModule {
}
