import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {UserProfileModule} from "../user-profile/user-profile.module";
import {AdminParkingsComponent} from "./admin-parkings.component";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {AdminParkingsRoutingModule} from "./admin-parkings-routing.module";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    AdminParkingsRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule
  ],
  declarations: [
    AdminParkingsComponent
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
export class AdminParkingsModule {}
