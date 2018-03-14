import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PageHeaderModule} from "../../shared/modules/page-header/page-header.module";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import {ParkingPageRoutingModule} from "./parking-page-routing.module";
import {ParkingPageComponent} from "./parking-page.component";
import {AgmCoreModule} from "@agm/core";
import {UserService} from "../../shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../../app.module";
import {UserProfileModule} from "../user-profile/user-profile.module";
@NgModule({
  imports: [
    CommonModule,
    ParkingPageRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZYATWwJ9fICcju7XEds-145iAX0VCbqc'
    })
  ],
  declarations: [
    ParkingPageComponent
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
export class ParkingPageModule {}
