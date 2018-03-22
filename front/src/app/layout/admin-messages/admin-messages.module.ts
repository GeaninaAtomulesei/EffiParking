import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {UserProfileModule} from "../user-profile/user-profile.module";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";
import {AdminMessagesComponent} from "./admin-messages.component";
import {AdminMessagesRoutingModule} from "./admin-messages-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AdminMessagesRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule
  ],
  declarations: [
    AdminMessagesComponent
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
export class AdminMessagesModule {}
