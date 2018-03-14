import {Routes} from "@angular/router";
import {EmployeeParkingPageComponent} from "./emp-parking-page.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: EmployeeParkingPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeParkingPageRoutingModule {}
