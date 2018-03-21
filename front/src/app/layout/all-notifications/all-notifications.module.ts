import {CommonModule} from "@angular/common";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";
import {AllNotificationsRoutingModule} from "./all-notifications-routing.module";
import {AllNotificationsComponent} from "./all-notifications.component";

@NgModule({
  imports: [
    CommonModule,
    AllNotificationsRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AllNotificationsComponent
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
export class AllNotificationsModule {}
