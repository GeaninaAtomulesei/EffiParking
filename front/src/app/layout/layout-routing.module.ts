import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'owner-page', loadChildren: './owner-page/owner-page.module#OwnerPageModule' },
      { path: 'reservations-page', loadChildren: './reservations-page/reservations-page.module#ReservationsPageModule'},
      { path: 'admin-users-page', loadChildren: './admin-users-page/admin-users-page.module#AdminUsersPageModule'},
      { path: 'admin-parkings', loadChildren: './admin-parkings/admin-parkings.module#AdminParkingsModule'},
      { path: 'admin-requests', loadChildren: './admin-requests/admin-requests.module#AdminRequestsModule'},
      { path: 'parking-page/:id', loadChildren: './parking-page/parking-page.module#ParkingPageModule'},
      { path: 'user-profile/:id', loadChildren: './user-profile/user-profile.module#UserProfileModule'},
      { path: 'emp-parking-page/:id', loadChildren: './emp-parking-page/emp-parking-page.module#EmployeeParkingPageModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
