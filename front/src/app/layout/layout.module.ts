import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import {LayoutRoutingModule} from "./layout-routing.module";
import {APP_INITIALIZER} from "@angular/core";
import {initUserFactory} from "../app.module";
import {UserService} from "../shared/services/user.service";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        FormsModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
    providers: [
      {
        'provide': APP_INITIALIZER,
        'useFactory': initUserFactory,
        'deps': [UserService],
        'multi': true
      }
    ]
})
export class LayoutModule {}
