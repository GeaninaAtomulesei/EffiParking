import {Routes} from "@angular/router";
import {OwnerEmployeesPageComponent} from "./owner-employees-page.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: OwnerEmployeesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerEmployeesPageRoutingModule {}
