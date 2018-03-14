import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParkingPageComponent} from "../parking-page/parking-page.component";

const routes: Routes = [
  {
    path: '',
    component: ParkingPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkingPageRoutingModule {}
