import {Routes} from "@angular/router";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminParkingsComponent} from "./admin-parkings.component";

const routes: Routes = [
  {
    path: '',
    component: AdminParkingsComponent
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
export class AdminParkingsRoutingModule {}
