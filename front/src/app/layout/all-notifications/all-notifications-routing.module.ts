import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {Routes} from "@angular/router";
import {AllNotificationsComponent} from "./all-notifications.component";
const routes: Routes = [
  {
    path: '',
    component: AllNotificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllNotificationsRoutingModule {}
