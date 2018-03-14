import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AuthGuard} from "./shared/guard/auth.guard";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {TranslateLoader} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "./shared/services/api.service";
import {AuthService} from "./shared/services/auth.service";
import {ConfigService} from "./shared/services/config.service";
import {UserService} from "./shared/services/user.service";
import {APP_INITIALIZER} from "@angular/core";
import {AgmCoreModule} from "@agm/core";

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  // for development
  // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initUserFactory(userService: UserService) {
  return () => userService.initUser();
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZYATWwJ9fICcju7XEds-145iAX0VCbqc'
    })
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    AuthService,
    UserService,
    ConfigService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
