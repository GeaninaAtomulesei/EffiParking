import {CommonModule} from "@angular/common";
import {HistoryPageRoutingModule} from "./history-page-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HistoryPageComponent} from "./history-page.component";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    HistoryPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    HistoryPageComponent
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
export class HistoryPageModule {}
