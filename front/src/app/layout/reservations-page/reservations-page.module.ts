import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ReservationsPageComponent} from "./reservations-page.component";
import {UserService} from "../../shared/services/user.service";
import {ReservationsPageRoutingModule} from "./reservations-page-routing.module";
import {ParkingService} from "../../shared/services/parking.service";
import {initUserFactory} from "../../app.module";
import {APP_INITIALIZER} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    ReservationsPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    ReservationsPageComponent
  ],
  providers: [
    UserService,
    ParkingService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ]
})
export class ReservationsPageModule {}
