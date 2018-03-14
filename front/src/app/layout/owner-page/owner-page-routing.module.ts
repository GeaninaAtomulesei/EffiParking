import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnerPageComponent} from "./owner-page.component";
import {ParkingPageComponent} from "../parking-page/parking-page.component";

const routes: Routes = [
  {
    path: '',
    component: OwnerPageComponent
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
export class OwnerPageRoutingModule {}
