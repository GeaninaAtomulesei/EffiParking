import {CommonModule} from "@angular/common";
import {ContactRoutingModule} from "./contact-routing.module";
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ContactComponent} from "./contact.component";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ContactRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    ContactComponent
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
export class ContactModule {}
