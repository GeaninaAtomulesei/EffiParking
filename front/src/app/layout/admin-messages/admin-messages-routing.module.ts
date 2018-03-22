import {Routes} from "@angular/router";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminMessagesComponent} from "./admin-messages.component";

const routes: Routes = [
  {
    path: '',
    component: AdminMessagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMessagesRoutingModule {}
