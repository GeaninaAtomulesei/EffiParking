import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ParkingPageModule} from "../parking-page/parking-page.module";
import {OwnerParkingsPageComponent} from "./owner-parkings-page.component";
import {ParkingService} from "../../shared/services/parking.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {UserService} from "../../shared/services/user.service";
import {OwnerParkingsPageRoutingModule} from "./owner-parkings-page-routing.module";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    OwnerParkingsPageRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ParkingPageModule
  ],
  declarations: [OwnerParkingsPageComponent],
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
export class OwnerParkingsPageModule {}
