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
      { path: 'owner-parkings-page', loadChildren: './owner-parkings-page/owner-parkings-page.module#OwnerParkingsPageModule' },
      { path: 'owner-employees-page', loadChildren: './owner-employees-page/owner-employees-page.module#OwnerEmployeesPageModule' },
      { path: 'reservations-page', loadChildren: './reservations-page/reservations-page.module#ReservationsPageModule'},
      { path: 'history-page', loadChildren: './history-page/history-page.module#HistoryPageModule'},
      { path: 'admin-users-page', loadChildren: './admin-users-page/admin-users-page.module#AdminUsersPageModule'},
      { path: 'admin-parkings', loadChildren: './admin-parkings/admin-parkings.module#AdminParkingsModule'},
      { path: 'admin-requests', loadChildren: './admin-requests/admin-requests.module#AdminRequestsModule'},
      { path: 'admin-messages', loadChildren: './admin-messages/admin-messages.module#AdminMessagesModule'},
      { path: 'parking-page/:id', loadChildren: './parking-page/parking-page.module#ParkingPageModule'},
      { path: 'user-profile/:id', loadChildren: './user-profile/user-profile.module#UserProfileModule'},
      { path: 'emp-parking-page/:id', loadChildren: './emp-parking-page/emp-parking-page.module#EmployeeParkingPageModule'},
      { path: 'all-notifications/:id', loadChildren: './all-notifications/all-notifications.module#AllNotificationsModule'},
      { path: 'contact', loadChildren: './contact/contact.module#ContactModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
