import {Routes} from "@angular/router";
import {UserProfileComponent} from "./user-profile.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule {}
