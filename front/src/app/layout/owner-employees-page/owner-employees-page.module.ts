import {CommonModule} from "@angular/common";
import {OwnerEmployeesPageRoutingModule} from "./owner-employees-page-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {OwnerEmployeesPageComponent} from "./owner-employees-page.component";
import {ParkingService} from "../../shared/services/parking.service";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    OwnerEmployeesPageRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [OwnerEmployeesPageComponent],
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
export class OwnerEmployeesPageModule {}
