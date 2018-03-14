import {Routes} from "@angular/router";
import {ReservationsPageComponent} from "./reservations-page.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: ReservationsPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsPageRoutingModule {}
