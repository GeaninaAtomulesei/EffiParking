import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {initUserFactory} from "../../app.module";
import {APP_INITIALIZER} from "@angular/core";
import {AdminUsersPageComponent} from "./admin-users-page.component";
import {AdminUsersPageRoutingModule} from "./admin-users-page-routing.module";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {UserProfileModule} from "../user-profile/user-profile.module";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    AdminUsersPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule
  ],
  declarations: [
    AdminUsersPageComponent
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
export class AdminUsersPageModule {}
