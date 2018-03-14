import {Routes} from "@angular/router";
import {AdminRequestsComponent} from "./admin-requests.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: AdminRequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRequestsRoutingModule {}
