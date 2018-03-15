import {ParkingPageComponent} from "../parking-page/parking-page.component";
import {OwnerParkingsPageComponent} from "./owner-parkings-page.component";
import {Routes} from "@angular/router";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: OwnerParkingsPageComponent
  },
  {
    path: '/parking-page/:id',
    component: ParkingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerParkingsPageRoutingModule {}
