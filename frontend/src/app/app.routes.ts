import { Routes } from '@angular/router';
import { NotfoundComponent } from './user/notfound/notfound.component';
import { userRoutes } from './user/user-routes';
import { adminRoutes } from './admin/admin-routes';

export const routes: Routes = [
  ...userRoutes,
  ...adminRoutes,
  { path: '**', component: NotfoundComponent }
];
