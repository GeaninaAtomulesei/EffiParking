import {CommonModule} from "@angular/common";
import {UserProfileRoutingModule} from "./user-profile-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {UserProfileComponent} from "./user-profile.component";
import {ParkingService} from "../../shared/services/parking.service";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";
@NgModule({
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    UserProfileComponent
  ],
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
export class UserProfileModule {}
