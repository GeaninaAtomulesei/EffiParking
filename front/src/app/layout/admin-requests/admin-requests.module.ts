import {CommonModule} from "@angular/common";
import {AdminRequestsRoutingModule} from "./admin-requests-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {UserProfileModule} from "../user-profile/user-profile.module";
import {AdminRequestsComponent} from "./admin-requests.component";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    AdminRequestsRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule
  ],
  declarations: [
    AdminRequestsComponent
  ],
  providers: [
    UserService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ]
})
export class AdminRequestsModule {}
