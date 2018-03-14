import {AdminUsersPageComponent} from "./admin-users-page.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {Routes} from "@angular/router";
import {UserProfileComponent} from "../user-profile/user-profile.component";

const routes: Routes = [
  {
    path: '',
    component: AdminUsersPageComponent
  },
  {
    path: '/user-profile/:id',
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsersPageRoutingModule {}
